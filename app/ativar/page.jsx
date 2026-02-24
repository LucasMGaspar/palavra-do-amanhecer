'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'

function AtivarForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const nomeParam = searchParams.get('name') || searchParams.get('nome') || ''
    const emailParam = searchParams.get('email') || ''

    const [nome, setNome] = useState(nomeParam)
    const [telefone, setTelefone] = useState('')
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')

    function formatarTelefone(valor) {
        // Remove tudo que não é número
        const nums = valor.replace(/\D/g, '')
        // Garante que começa com 55 (DDI Brasil)
        if (nums.length === 0) return ''
        return nums.startsWith('55') ? nums : '55' + nums
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErro('')
        const tel = formatarTelefone(telefone)

        if (tel.length < 12 || tel.length > 13) {
            setErro('Informe um número válido com DDD. Ex: 11 99999-9999')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ativar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, telefone: tel, email: emailParam }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Erro ao ativar')
            router.push('/sucesso')
        } catch (err) {
            setErro(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main style={{
            minHeight: '100vh',
            background: '#09080f',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* Ícone */}
            <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🎉</div>

            {/* Título */}
            <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                fontWeight: 300,
                textAlign: 'center',
                marginBottom: '0.5rem',
                lineHeight: 1.2,
            }}>
                Pagamento confirmado!<br />
                <em style={{ color: '#f0c060' }}>Ative sua jornada</em>
            </h1>

            <p style={{
                color: 'rgba(255,255,255,.5)',
                fontSize: '1rem',
                lineHeight: 1.7,
                textAlign: 'center',
                maxWidth: '440px',
                marginBottom: '2.5rem',
            }}>
                Precisamos do seu WhatsApp para enviar as mensagens diárias.
                Informe o número com DDD — sem o <strong style={{ color: 'rgba(255,255,255,.7)' }}>+55</strong>, adicionamos automaticamente.
            </p>

            {/* Formulário */}
            <form onSubmit={handleSubmit} style={{
                width: '100%',
                maxWidth: '420px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}>
                {/* Nome */}
                <div>
                    <label style={{ fontSize: '0.8rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase' }}>
                        Seu nome
                    </label>
                    <input
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                        placeholder="João Silva"
                        style={inputStyle}
                    />
                </div>

                {/* WhatsApp */}
                <div>
                    <label style={{ fontSize: '0.8rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase' }}>
                        WhatsApp (com DDD)
                    </label>
                    <input
                        type="tel"
                        value={telefone}
                        onChange={e => setTelefone(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="11 99999-9999"
                        maxLength={11}
                        style={inputStyle}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.3)', marginTop: '0.3rem' }}>
                        Exemplo: 11 99999-9999 (DDI 55 adicionado automaticamente)
                    </p>
                </div>

                {/* Erro */}
                {erro && (
                    <p style={{
                        background: 'rgba(220,50,50,.15)',
                        border: '1px solid rgba(220,50,50,.3)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        color: '#ff6b6b',
                        fontSize: '0.9rem',
                    }}>
                        {erro}
                    </p>
                )}

                {/* Botão */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: loading ? 'rgba(240,192,96,.4)' : 'linear-gradient(135deg, #f0c060, #d4a032)',
                        color: '#09080f',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '0.5rem',
                        transition: 'opacity .2s',
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    {loading ? 'Ativando...' : 'Ativar minha assinatura →'}
                </button>
            </form>

            {/* Versículo */}
            <p style={{
                color: 'rgba(240,192,96,.5)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                fontStyle: 'italic',
                marginTop: '3rem',
                textAlign: 'center',
            }}>
                "O Senhor vai adiante de você."<br />
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.2)' }}>— Deuteronômio 31:8</span>
            </p>
        </main>
    )
}

const inputStyle = {
    display: 'block',
    width: '100%',
    marginTop: '0.4rem',
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: '10px',
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
}

export default function AtivarPage() {
    return (
        <Suspense fallback={null}>
            <AtivarForm />
        </Suspense>
    )
}
