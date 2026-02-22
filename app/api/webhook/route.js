import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// ── VALIDA ASSINATURA DO MERCADO PAGO ──────────────────────────────
function validarAssinatura(req, body) {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true // desabilita validação em dev

  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  const urlParams   = new URL(req.url).searchParams
  const dataId      = urlParams.get('data.id')

  if (!xSignature) return false

  // monta o manifest conforme documentação do MP
  const parts = xSignature.split(',')
  const ts    = parts.find(p => p.startsWith('ts='))?.split('=')[1]
  const v1    = parts.find(p => p.startsWith('v1='))?.split('=')[1]

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return hmac === v1
}

// ── BUSCA DADOS DO PAGAMENTO NA API DO MP ──────────────────────────
async function buscarPagamento(paymentId) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error(`Erro MP: ${res.status}`)
  return res.json()
}

// ── BUSCA DADOS DA ASSINATURA NA API DO MP ─────────────────────────
async function buscarAssinatura(preapprovalId) {
  const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error(`Erro MP assinatura: ${res.status}`)
  return res.json()
}

// ── CADASTRA ASSINANTE NO SUPABASE ─────────────────────────────────
async function cadastrarAssinante({ nome, telefone, email, mpId }) {
  // verifica se já existe
  const supabase = getSupabase()

  const { data: existente } = await supabase
    .from('assinantes')
    .select('id, status')
    .eq('telefone', telefone)
    .single()

  if (existente) {
    // reativa se estava cancelado
    if (existente.status !== 'ativo') {
      await supabase
        .from('assinantes')
        .update({ status: 'ativo', dia_atual: 1 })
        .eq('id', existente.id)
    }
    return existente.id
  }

  // cadastra novo
  const { data, error } = await supabase
    .from('assinantes')
    .insert({
      nome,
      telefone,
      status: 'ativo',
      dia_atual: 1,
      data_inicio: new Date().toISOString().split('T')[0],
    })
    .select('id')
    .single()

  if (error) throw new Error(`Erro Supabase: ${error.message}`)
  return data.id
}

// ── ENVIA MENSAGEM DE BOAS-VINDAS ──────────────────────────────────
async function enviarBoasVindas(telefone, nome) {
  const nomeCurto = nome.split(' ')[0]
  const mensagem = `🎉 *Bem-vindo(a), ${nomeCurto}!*\n\nEstou muito feliz de ter você aqui. A partir de amanhã você vai receber todo dia, às 7h da manhã, uma mensagem com versículo, reflexão e uma ação prática para começar o dia com Deus.\n\nVocê não vai caminhar sozinho(a). 🙏\n\n_"O Senhor vai adiante de você; ele estará com você."_ — Deuteronômio 31:8\n\nQual é o seu maior pedido de oração agora? Me conta — quero começar orando por você. ❤️`

  const res = await fetch(
    `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.EVOLUTION_API_KEY,
      },
      body: JSON.stringify({ number: telefone, text: mensagem }),
    }
  )

  if (!res.ok) {
    console.error('Erro ao enviar boas-vindas:', await res.text())
  }
}

// ── HANDLER PRINCIPAL ──────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json()

    // valida assinatura
    if (!validarAssinatura(req, body)) {
      console.warn('Webhook com assinatura inválida')
      return Response.json({ error: 'Assinatura inválida' }, { status: 401 })
    }

    const { type, action, data } = body

    // ── PAGAMENTO APROVADO (plano pago ou primeiro pagamento) ───────
    if (type === 'payment' && action === 'payment.updated') {
      const pagamento = await buscarPagamento(data.id)

      if (pagamento.status !== 'approved') {
        return Response.json({ ok: true, msg: 'Pagamento não aprovado, ignorado' })
      }

      const { payer, metadata } = pagamento

      const nome     = payer?.name || metadata?.nome || 'Assinante'
      const email    = payer?.email
      const telefone = metadata?.telefone || payer?.phone?.number

      if (!telefone) {
        console.error('Telefone não encontrado no pagamento:', data.id)
        return Response.json({ error: 'Telefone não encontrado' }, { status: 422 })
      }

      const assinanteId = await cadastrarAssinante({
        nome, telefone: telefone.replace(/\D/g, ''), email, mpId: data.id,
      })

      await enviarBoasVindas(telefone.replace(/\D/g, ''), nome)

      console.log(`✅ Assinante cadastrado: ${nome} (${telefone}) — ID: ${assinanteId}`)
      return Response.json({ ok: true, assinanteId })
    }

    // ── ASSINATURA CANCELADA ────────────────────────────────────────
    if (type === 'subscription_preapproval' && action === 'updated') {
      const assinatura = await buscarAssinatura(data.id)

      if (assinatura.status === 'cancelled') {
        const telefone = assinatura.payer?.phone?.number
        if (telefone) {
          await getSupabase()
            .from('assinantes')
            .update({ status: 'cancelado' })
            .eq('telefone', telefone.replace(/\D/g, ''))

          console.log(`❌ Assinante cancelado: ${telefone}`)
        }
      }

      return Response.json({ ok: true })
    }

    // outros eventos — ignorar
    return Response.json({ ok: true, msg: `Evento ${type}/${action} ignorado` })

  } catch (err) {
    console.error('Erro no webhook:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// Mercado Pago faz GET para validar a URL do webhook
export async function GET() {
  return Response.json({ ok: true, service: 'Palavra do Amanhecer Webhook' })
}
