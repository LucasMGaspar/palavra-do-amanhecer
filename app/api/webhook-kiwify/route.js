import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// ── VALIDA TOKEN DE AUTENTICAÇÃO DA KIWIFY ─────────────────────────
// A Kiwify pode enviar o token de diferentes formas
function validarToken(req, body) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN
  if (!token) return true // desabilita validação se não configurado

  // Verifica em múltiplos headers e no body
  const authHeader = req.headers.get('authorization') || ''
  const tokenHeader = req.headers.get('x-token') || req.headers.get('x-webhook-token') || ''
  const tokenBody = body?.token || body?.webhook_token || ''

  const candidatos = [
    authHeader,
    authHeader.replace('Bearer ', '').trim(),
    tokenHeader,
    tokenBody,
  ]

  return candidatos.some(c => c === token)
}


// ── CADASTRA / REATIVA ASSINANTE NO SUPABASE ───────────────────────
async function cadastrarAssinante({ nome, telefone, email, status = 'ativo' }) {
  const supabase = getSupabase()

  // Se vier com telefone, verifica duplicata por telefone
  if (telefone) {
    const { data: existente } = await supabase
      .from('assinantes')
      .select('id, status')
      .eq('telefone', telefone)
      .maybeSingle()

    if (existente) {
      if (existente.status !== 'ativo') {
        await supabase
          .from('assinantes')
          .update({ status: 'ativo', dia_atual: 1 })
          .eq('id', existente.id)
      }
      return existente.id
    }
  }

  // Sem telefone: verifica por email para evitar duplicata pendente
  if (!telefone && email) {
    const { data: existenteEmail } = await supabase
      .from('assinantes')
      .select('id, status')
      .eq('email', email)
      .maybeSingle()

    if (existenteEmail) return existenteEmail.id
  }

  // Cadastra novo (pode ser pendente se sem telefone)
  const { data, error } = await supabase
    .from('assinantes')
    .insert({
      nome,
      telefone: telefone || null,
      email: email || null,
      status,
      dia_atual: 1,
      data_inicio: new Date().toISOString().split('T')[0],
    })
    .select('id')
    .single()

  if (error) throw new Error(`Erro Supabase: ${error.message}`)
  return data.id
}

// ── CANCELA ASSINANTE NO SUPABASE ──────────────────────────────────
async function cancelarAssinante(telefone) {
  const supabase = getSupabase()
  await supabase
    .from('assinantes')
    .update({ status: 'cancelado' })
    .eq('telefone', telefone)

  console.log(`❌ Assinante cancelado: ${telefone}`)
}

// ── ENVIA MENSAGEM DE BOAS-VINDAS VIA Z-API ────────────────────────
async function enviarBoasVindas(telefone, nome) {
  const nomeCurto = nome.split(' ')[0]
  const mensagem = `🎉 *Bem-vindo(a), ${nomeCurto}!*\n\nEstou muito feliz de ter você aqui. A partir de amanhã você vai receber todo dia, às 7h da manhã, uma mensagem com versículo, reflexão e uma ação prática para começar o dia com Deus.\n\nVocê não vai caminhar sozinho(a). 🙏\n\n_"O Senhor vai adiante de você; ele estará com você."_ — Deuteronômio 31:8\n\nQual é o seu maior pedido de oração agora? Me conta — quero começar orando por você. ❤️`

  // Z-API: https://api.z-api.io/instances/{id}/token/{token}/send-text
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Token': process.env.ZAPI_CLIENT_TOKEN,
    },
    body: JSON.stringify({ phone: telefone, message: mensagem }),
  })

  if (!res.ok) {
    console.error('Erro ao enviar boas-vindas via Z-API:', await res.text())
  }
}

// ── HANDLER PRINCIPAL ──────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json()

    // valida token da Kiwify (passa body para checar token no payload também)
    if (!validarToken(req, body)) {
      console.warn('Kiwify webhook: token inválido')
      return Response.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { order_status, Customer, Subscription } = body

    // normaliza o número de telefone (remove +, espaços e caracteres especiais)
    const telefoneRaw = Customer?.mobile || Customer?.phone || ''
    const telefone = telefoneRaw.replace(/\D/g, '')
    const nome = Customer?.full_name || Customer?.name || 'Assinante'
    const email = Customer?.email || ''

    // ── COMPRA APROVADA ─────────────────────────────────────────────
    if (order_status === 'paid') {
      if (!telefone) {
        // Salva como pendente: cliente vai completar na página /ativar
        const assinanteId = await cadastrarAssinante({ nome, email, status: 'pendente' })
        console.log(`⏳ Kiwify — assinante PENDENTE (sem telefone): ${nome} (${email}) — ID: ${assinanteId}`)
        return Response.json({ ok: true, status: 'pendente', assinanteId })
      }

      const assinanteId = await cadastrarAssinante({ nome, telefone, email })
      await enviarBoasVindas(telefone, nome)
      console.log(`✅ Kiwify — assinante cadastrado: ${nome} (${telefone}) — ID: ${assinanteId}`)
      return Response.json({ ok: true, assinanteId })
    }

    // ── ASSINATURA CANCELADA / REEMBOLSADA ──────────────────────────
    const isCancelado =
      order_status === 'cancelled' ||
      order_status === 'refunded' ||
      order_status === 'chargedback' ||
      Subscription?.status === 'cancelled'

    if (isCancelado) {
      await cancelarAssinante(telefone)
      return Response.json({ ok: true })
    }

    // outros eventos — ignorar
    console.log(`Kiwify webhook — evento ignorado: order_status=${order_status}`)
    return Response.json({ ok: true, msg: `Evento ${order_status} ignorado` })

  } catch (err) {
    console.error('Erro no webhook Kiwify:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// Kiwify pode fazer GET para validar a URL
export async function GET() {
  return Response.json({ ok: true, service: 'Palavra do Amanhecer — Kiwify Webhook' })
}
