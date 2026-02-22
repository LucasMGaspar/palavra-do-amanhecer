export default function Sucesso() {
  return (
    <main style={{
      minHeight: '100vh', background: '#09080f', color: '#fff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🙏</div>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 300, marginBottom: '1rem',
      }}>
        Bem-vindo(a) à família!
      </h1>
      <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '480px', marginBottom: '2rem' }}>
        Sua assinatura foi confirmada. Amanhã às 7h você já recebe sua primeira mensagem no WhatsApp.
        Fique de olho — ela chega com seu nome. 🌅
      </p>
      <p style={{ color: 'rgba(240,192,96,.7)', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontStyle: 'italic' }}>
        "O Senhor vai adiante de você."<br />
        <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,.3)' }}>— Deuteronômio 31:8</span>
      </p>
    </main>
  )
}
