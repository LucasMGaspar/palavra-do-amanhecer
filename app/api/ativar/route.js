import { createClient } from '@supabase/supabase-js'

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    )
}

async function enviarBoasVindas(telefone, nome) {
    const nomeCurto = nome.split(' ')[0]
    const mensagem = `🎉 *Bem-vindo(a), ${nomeCurto}!*\n\nEstou muito feliz de ter você aqui. A partir de amanhã você vai receber todo dia, às 7h da manhã, o guia do dia com contexto histórico, a passagem e uma oração.\n\nVocê não vai caminhar sozinho(a). 🙏\n\n_"O Senhor vai adiante de você; ele estará com você."_ — Deuteronômio 31:8\n\nQual é o seu maior pedido de oração agora? Me conta — quero começar orando por você. ❤️`

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

export async function POST(req) {
    try {
        const { nome, telefone, email } = await req.json()

        // Valida campos obrigatórios
        if (!nome || !telefone) {
            return Response.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
        }

        // Valida formato do telefone (deve ter DDI 55 + DDD + número = 12 ou 13 dígitos)
        const tel = telefone.replace(/\D/g, '')
        if (tel.length < 12 || tel.length > 13) {
            return Response.json({ error: 'Telefone inválido. Informe com DDD, ex: 11999999999' }, { status: 400 })
        }

        const supabase = getSupabase()
        const hoje = new Date().toISOString().split('T')[0]

        // Verifica se já existe pelo email (veio do webhook sem telefone → atualiza)
        if (email) {
            const { data: existentePorEmail } = await supabase
                .from('assinantes')
                .select('id, status, telefone')
                .eq('email', email)
                .maybeSingle()

            if (existentePorEmail) {
                // Já tem telefone e está ativo → nada a fazer, redireciona para sucesso
                if (existentePorEmail.telefone && existentePorEmail.status === 'ativo') {
                    return Response.json({ ok: true, msg: 'Assinante já ativo' })
                }

                // Atualiza com o telefone e ativa
                await supabase
                    .from('assinantes')
                    .update({
                        nome,
                        telefone: tel,
                        status: 'ativo',
                        dia_atual: 1,
                        data_inicio: hoje,
                    })
                    .eq('id', existentePorEmail.id)

                await enviarBoasVindas(tel, nome)
                console.log(`✅ Ativação: assinante atualizado: ${nome} (${tel})`)
                return Response.json({ ok: true })
            }
        }

        // Verifica se já existe pelo telefone
        const { data: existentePorTel } = await supabase
            .from('assinantes')
            .select('id, status')
            .eq('telefone', tel)
            .maybeSingle()

        if (existentePorTel) {
            if (existentePorTel.status !== 'ativo') {
                await supabase
                    .from('assinantes')
                    .update({ status: 'ativo', dia_atual: 1 })
                    .eq('id', existentePorTel.id)
                await enviarBoasVindas(tel, nome)
            }
            return Response.json({ ok: true, msg: 'Assinante reativado' })
        }

        // Cadastra novo assinante
        const { data, error } = await supabase
            .from('assinantes')
            .insert({
                nome,
                telefone: tel,
                email: email || null,
                status: 'ativo',
                dia_atual: 1,
                data_inicio: hoje,
            })
            .select('id')
            .single()

        if (error) throw new Error(`Supabase: ${error.message}`)

        await enviarBoasVindas(tel, nome)
        console.log(`✅ Ativação: novo assinante: ${nome} (${tel}) — ID: ${data.id}`)
        return Response.json({ ok: true, assinanteId: data.id })

    } catch (err) {
        console.error('Erro em /api/ativar:', err)
        return Response.json({ error: err.message }, { status: 500 })
    }
}
