'use client'

import { useEffect, useRef, useState } from 'react'

const MP_LINK = process.env.NEXT_PUBLIC_MP_LINK || 'https://mpago.la/SEU_LINK_AQUI'

export default function Home() {
  const canvasRef = useRef(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  // ── AURORA CANVAS ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, t = 0, animId

    const blobs = [
      { x: .5, y: .9,  r: .55, c: [217,149,60],  spd: .0003 },
      { x: .3, y: .8,  r: .45, c: [184,83,112],  spd: .0004 },
      { x: .7, y: .85, r: .4,  c: [59,37,103],   spd: .00025 },
      { x: .5, y: 1,   r: .6,  c: [30,22,64],    spd: .0002 },
    ]

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, W, H)
      blobs.forEach((b, i) => {
        const x = (b.x + Math.sin(t * b.spd * 1000 + i) * .12) * W
        const y = (b.y + Math.cos(t * b.spd * 800  + i) * .06) * H
        const r = b.r * Math.min(W, H)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `rgba(${b.c},0.22)`)
        g.addColorStop(1, `rgba(${b.c},0)`)
        ctx.beginPath(); ctx.fillStyle = g
        ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      })
      t++
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── PARTÍCULAS ───────────────────────────────────
  useEffect(() => {
    const container = document.getElementById('particles')
    if (!container) return
    for (let i = 0; i < 55; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 2.2 + .4
      const dur  = 3 + Math.random() * 5
      const del  = Math.random() * 6
      p.style.cssText = `
        position:absolute; border-radius:50%; background:white;
        width:${size}px; height:${size}px;
        top:${Math.random()*65}%; left:${Math.random()*100}%;
        animation: starAnim ${dur}s ${del}s ease-in-out infinite alternate;
      `
      container.appendChild(p)
    }
  }, [])

  // ── SCROLL REVEAL ────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: .12 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // ── NAV SCROLL ───────────────────────────────────
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── TYPING ANIMATION ─────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setShowBubble(true), 2200)
    const interval = setInterval(() => {
      setShowBubble(false)
      setTimeout(() => setShowBubble(true), 2200)
    }, 8000)
    return () => { clearTimeout(t1); clearInterval(interval) }
  }, [])

  const faqs = [
    { q: 'É para evangélicos ou católicos?', a: 'Para todos os cristãos. O conteúdo é baseado na Bíblia e em princípios universais da fé cristã, sem denominação específica. Evangélicos, católicos e qualquer pessoa que queira se aproximar de Deus são igualmente bem-vindos.' },
    { q: 'Como funcionam os 7 dias grátis?', a: 'Você começa a receber as mensagens no dia seguinte ao cadastro, sem pagar nada. Nos primeiros 7 dias, a assinatura não é cobrada. Se quiser continuar, os R$ 14,90 entram automaticamente. Se não quiser, é só cancelar antes — sem perguntas, sem retenção.' },
    { q: 'Precisa instalar algum aplicativo?', a: 'Não. Tudo chega direto no WhatsApp que você já usa todos os dias. Sem baixar nada, sem criar conta, sem aprender nenhuma tecnologia nova.' },
    { q: 'Como funciona o cancelamento?', a: 'Basta mandar uma mensagem pedindo o cancelamento no próprio WhatsApp. Sem formulários complicados, sem ligação, sem aquelas tentativas chatas de te convencer. Resolvemos na hora.' },
    { q: 'Meu número fica seguro?', a: 'Sim. Seu número é usado exclusivamente para enviar as mensagens do Palavra do Amanhecer. Nunca compartilhamos com terceiros, nunca vendemos dados, nunca enviamos spam.' },
  ]

  return (
    <>
      <canvas ref={canvasRef} id="aurora-canvas" />
      <div id="particles" />

      {/* ── NAV ─────────────────────────────────── */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">🌅<span className="dot"> ✦ </span>Palavra do Amanhecer</div>
        <a href="#assinar" className="nav-cta">Começar grátis</a>
      </nav>

      {/* ── HERO ────────────────────────────────── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="line" />
          Devocional diário no WhatsApp
          <span className="line" />
        </div>

        <h1>
          Todo dia às 7h,<br />
          <span className="italic">a Palavra de Deus</span><br />
          chega com o <span className="outline">seu nome</span>
        </h1>

        <p className="hero-sub">
          Uma mensagem personalizada com versículo, reflexão e oração —
          direto no seu WhatsApp. Para você não começar mais nenhum dia no vazio.
        </p>

        <div className="hero-actions">
          <a href="#assinar" className="btn-primary">
            Quero receber amanhã cedo
            <span className="btn-arrow">→</span>
          </a>
          <span className="hero-reassure">
            <span>7 dias grátis</span> · R$ 14,90/mês · Cancele quando quiser
          </span>
        </div>

        <div className="social-proof">
          <div className="avatars">
            {['🙏','✨','☀️','🌸'].map((e, i) => (
              <div key={i} className="avatar">{e}</div>
            ))}
          </div>
          <div className="social-proof-text">
            <strong>+1.200 pessoas</strong> já começam o dia assim<br />
            <span style={{ fontSize: '.75rem' }}>Evangélicos, católicos e todos que amam a Deus</span>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Descubra mais</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── DORES ───────────────────────────────── */}
      <section className="pain-section">
        <span className="section-tag reveal">Você se reconhece nisso?</span>
        <h2 className="section-title reveal">Muita gente começa o dia<br /><em>do jeito errado</em></h2>
        <p className="pain-intro reveal">
          Você acorda, pega o celular e já cai no <strong>Instagram, notícias ruins, mensagens de trabalho</strong>.
          O dia começa agitado antes mesmo de você sair da cama.
          A fé fica pra depois — mas o "depois" nunca chega.
        </p>
        <div className="pain-cards">
          {[
            { icon: '📱', title: 'O celular é a primeira coisa', desc: 'A rede social entra antes de qualquer oração. O dia começa com ansiedade em vez de paz.' },
            { icon: '📖', title: 'A Bíblia fica pra depois', desc: 'Você quer ler, quer orar, mas a correria vence. E a culpa fica.' },
            { icon: '🌀', title: 'Os dias passam no automático', desc: 'Sem propósito, sem direção, sem aquele momento que ancora tudo.' },
          ].map((c, i) => (
            <div key={i} className={`pain-card reveal reveal-delay-${i+1}`}>
              <div className="icon">{c.icon}</div>
              <p><strong>{c.title}</strong>{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="pain-bridge reveal">
          "E se o primeiro pensamento do seu dia fosse<br />uma palavra de Deus com o seu nome?"
        </p>
      </section>

      {/* ── PREVIEW ─────────────────────────────── */}
      <section className="preview-section">
        <div className="section-center">
          <span className="section-tag reveal">Assim chega no seu WhatsApp</span>
          <h2 className="section-title reveal">Uma mensagem que parece<br /><em>feita só pra você</em></h2>
        </div>

        <div className="preview-inner">
          <div className="preview-copy reveal">
            <h3>Porque <em>é feita</em><br />só pra você</h3>
            <p>Cada mensagem carrega o seu nome, fala com o momento da sua semana e termina com uma ação prática pra colocar em prática ainda hoje.</p>
            <p>Não é um versículo jogado no grupo da família. É uma mensagem pensada, no horário certo, esperando por você quando você mais precisa.</p>
            <ul className="check-list">
              <li>Seu nome em cada mensagem — não é disparo em massa</li>
              <li>Conteúdo temático semanal com continuidade</li>
              <li>Tom interdenominacional — evangélicos e católicos</li>
              <li>Oração personalizada com seu pedido específico</li>
            </ul>
          </div>

          <div className="phone-scene reveal reveal-delay-2">
            <div className="phone-glow-bg" />
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-header">
                <div className="p-avatar">🌅</div>
                <div>
                  <div className="p-name">Palavra do Amanhecer</div>
                  <div className="p-status">online agora</div>
                </div>
              </div>
              {!showBubble && (
                <div className="typing">
                  <span /><span /><span />
                </div>
              )}
              {showBubble && (
                <div className="bubble">
                  <div>🌅 <span className="b-bold">Bom dia, Maria!</span> ☀️</div>
                  <div className="b-divider" />
                  <div>📖 <span className="b-bold">Versículo de hoje:</span></div>
                  <div className="b-verse">"Não temas, porque eu sou contigo." — Isaías 41:10</div>
                  <div className="b-divider" />
                  <div>💭 <span className="b-bold">Reflexão:</span></div>
                  <div style={{ margin: '.3rem 0', color: '#ccc' }}>Você não está sozinha hoje. Em cada passo que der, Ele vai à frente.</div>
                  <div className="b-divider" />
                  <div className="b-task">✅ Dê hoje o primeiro passo naquilo que o medo tem te impedido.</div>
                  <div className="b-divider" />
                  <div className="b-muted">🙏 Que seu dia seja abençoado, Maria. Até amanhã!</div>
                </div>
              )}
              <div className="b-time">07:00 ✓✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ───────────────────────── */}
      <section className="how-section">
        <span className="section-tag reveal">Simples assim</span>
        <h2 className="section-title reveal">Em 3 passos você<br /><em>já recebe amanhã</em></h2>
        <div className="timeline">
          {[
            { n: '1', title: 'Clique e se cadastre', desc: 'Nome e número do WhatsApp. Menos de 2 minutos.' },
            { n: '2', title: 'Confirme no Mercado Pago', desc: 'Pagamento 100% seguro. Começa com 7 dias grátis.' },
            { n: '3', title: 'Receba amanhã às 7h', desc: 'Sua primeira mensagem já chega no dia seguinte.' },
          ].map((s, i) => (
            <div key={i} className={`tl-step reveal reveal-delay-${i+1}`}>
              <div className="tl-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GRADE DA SEMANA ─────────────────────── */}
      <section className="week-section">
        <div className="section-center">
          <span className="section-tag reveal">O que você recebe</span>
          <h2 className="section-title reveal">Uma semana completa<br /><em>de presença</em></h2>
        </div>
        <div className="week-grid">
          {[
            { e:'📖', n:'Seg', d:'Versículo + reflexão + ação', s:false },
            { e:'🔥', n:'Ter', d:'Versículo + reflexão + ação', s:false },
            { e:'✨', n:'Qua', d:'Versículo + reflexão + ação', s:false },
            { e:'💪', n:'Qui', d:'Versículo + reflexão + ação', s:false },
            { e:'🌟', n:'Sex', d:'Versículo + reflexão + ação', s:false },
            { e:'🌸', n:'Sáb', d:'Resumo + oração', s:true },
            { e:'☀️', n:'Dom', d:'Mensagem leve', s:true },
          ].map((d, i) => (
            <div key={i} className={`day-card reveal reveal-delay-${Math.min(i+1,4)} ${d.s ? 'special' : ''}`}>
              <div className="day-emoji">{d.e}</div>
              <div className="day-name">{d.n}</div>
              <div className="day-desc">{d.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ───────────────────────────────── */}
      <section className="quote-section">
        <blockquote className="reveal">
          "Não deixe o dia começar<br />antes de você ter dado a<br /><em>primeira palavra para Deus</em>"
        </blockquote>
        <cite className="reveal">Palavra do Amanhecer</cite>
      </section>

      {/* ── PREÇO ───────────────────────────────── */}
      <section className="price-section" id="assinar">
        <span className="section-tag reveal">Investimento</span>
        <h2 className="section-title reveal">Menos que um café.<br /><em>Vale muito mais.</em></h2>

        <div className="price-card reveal">
          <span className="price-tag">✦ Mais escolhido</span>
          <div className="price-name">Palavra do Amanhecer</div>
          <div className="price-display">
            <span className="p-cur">R$</span>
            <span className="p-val">14</span>
            <span className="p-dec">,90</span>
          </div>
          <div className="price-equiv">por mês · menos de R$ 0,50 por dia</div>
          <div className="price-divider" />
          <ul className="price-features">
            {[
              'Devocional diário de segunda a sexta',
              'Resumo semanal + oração no sábado',
              'Mensagem leve todo domingo',
              'Oração personalizada quinzenal',
              'Mensagem especial no seu aniversário',
              '7 dias grátis para experimentar',
              'Cancele quando quiser, sem burocracia',
            ].map((f, i) => (
              <li key={i}><span className="check">✓</span>{f}</li>
            ))}
          </ul>
          <a href={MP_LINK} className="btn-primary btn-full">
            Começar meus 7 dias grátis
            <span className="btn-arrow">→</span>
          </a>
          <p className="price-lock">
            🔒 Pagamento seguro pelo Mercado Pago.<br />
            Sem fidelidade. Cancele a qualquer momento.<br />
            <a href="/privacidade">Política de privacidade</a> · <a href="/termos">Termos de uso</a>
          </p>
        </div>
      </section>

      {/* ── DEPOIMENTOS ─────────────────────────── */}
      <section className="testimonials-section">
        <div className="section-center">
          <span className="section-tag reveal">Quem já acorda diferente</span>
          <h2 className="section-title reveal">Eles também<br /><em>duvidaram antes</em></h2>
        </div>
        <div className="testimonials-grid">
          {[
            { stars:'★★★★★', text:'"Honestamente, não achei que ia fazer diferença. Mas na terceira mensagem eu estava chorando antes de sair pro trabalho. Parecia que Deus estava me respondendo."', name:'Ana Paula, 34 anos', loc:'São Paulo, SP · Evangélica' },
            { stars:'★★★★★', text:'"Sou católico e fiquei desconfiado no começo. Mas não tem nada sectário — é só a Palavra de Deus, bem escrita, no momento certo. Me sinto acolhido."', name:'Roberto, 47 anos', loc:'Belo Horizonte, MG · Católico' },
            { stars:'★★★★★', text:'"A oração com o meu nome e o meu pedido... nunca tinha recebido algo assim. Parece que tem alguém de verdade intercedendo por mim todo dia."', name:'Fernanda, 29 anos', loc:'Rio de Janeiro, RJ · Evangélica' },
          ].map((t, i) => (
            <div key={i} className={`t-card reveal reveal-delay-${i+1}`}>
              <div className="t-stars">{t.stars}</div>
              <p className="t-text">{t.text}</p>
              <div className="t-author"><strong>{t.name}</strong>{t.loc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────── */}
      <section className="faq-section">
        <div className="section-center" style={{ marginBottom: '1rem' }}>
          <span className="section-tag reveal">Antes de decidir</span>
          <h2 className="section-title reveal">Perguntas <em>frequentes</em></h2>
        </div>
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
            <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q} <span className="faq-icon">+</span>
            </button>
            <div className="faq-a">{f.a}</div>
          </div>
        ))}
      </section>

      {/* ── CTA FINAL ───────────────────────────── */}
      <section className="final-cta">
        <h2 className="reveal">
          Amanhã você vai acordar<br />
          e o <em>primeiro pensamento</em><br />
          vai ser de Deus
        </h2>
        <p className="reveal">
          Uma palavra com o seu nome. Um versículo escolhido pra esse momento da sua vida.
          Uma oração por você. Todo dia. Sem falhar.
        </p>
        <a href="#assinar" className="btn-primary reveal">
          Quero começar amanhã cedo
          <span className="btn-arrow">→</span>
        </a>
        <p className="final-note reveal">7 dias grátis · R$ 14,90/mês depois · Cancele quando quiser</p>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer>
        <p>© 2025 Palavra do Amanhecer · Todos os direitos reservados</p>
        <p><a href="/privacidade">Privacidade</a> · <a href="/termos">Termos</a> · <a href="mailto:oi@palavradoamanhecer.com.br">Contato</a></p>
      </footer>
    </>
  )
}
