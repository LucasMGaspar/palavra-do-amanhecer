'use client'

import { useEffect, useState } from 'react'

const MP_LINK = process.env.NEXT_PUBLIC_MP_LINK || '#'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const faqs = [
    { q: 'Precisa ter algum aplicativo especial?', a: 'Não. Tudo chega pelo WhatsApp mesmo — que você já usa. Não precisa baixar nada, criar conta em nada. Só ter WhatsApp.' },
    { q: 'Qual versão da Bíblia devo usar?', a: 'Qualquer versão que você já tem — física ou em app. Pode ser NVI, ARA, ACF, NVT. O guia cita os livros e capítulos, e você lê na sua versão favorita.' },
    { q: 'E se eu perder um dia?', a: 'Sem problema. O seu progresso fica salvo. No dia seguinte você recebe o próximo dia normalmente. Pode retomar quando quiser.' },
    { q: 'Quanto tempo leva por dia?', a: 'Em média 15 minutos. Alguns dias são mais curtos, outros um pouco mais longos — mas nunca mais de 25 minutos para ler os capítulos do dia.' },
    { q: 'A ordem cronológica começa por onde?', a: 'Começa pelo livro de Jó — o mais antigo da Bíblia — e segue pela ordem histórica dos eventos. É a forma mais imersiva de entender como a história de Deus com a humanidade se desenvolve no tempo real.' },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-bg"></div>
        <div className="hero-lines"></div>

        <div className="badge">
          <span className="badge-dot"></span>
          Guia Bíblico pelo WhatsApp
        </div>

        <h1>Leia a <em>Bíblia inteira</em><br />em 1 ano</h1>
        <p className="hero-subtitle">Todo dia às 7h, você recebe no WhatsApp o contexto, a passagem do dia e uma oração — tudo que precisa para entender a Bíblia de verdade.</p>

        <div className="hero-cta">
          <a href="#comprar" className="btn-primary">
            Começar minha jornada
            <span>→</span>
          </a>
          <p className="hero-price-note">Pagamento único de <strong>R$ 47,00</strong> · Acesso aos 365 dias</p>
        </div>

        <div className="scroll-indicator">
          <span>Rolar</span>
          <div className="scroll-line"></div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ── PROBLEMA ── */}
      <div className="problem reveal">
        <p className="problem-quote">Quero ler a Bíblia inteira, mas nunca sei por onde começar — e sempre desisto no meio do caminho.</p>
        <p className="problem-text">A maioria dos cristãos já tentou ler a Bíblia do início ao fim e parou em Levítico. Não por falta de fé — mas por falta de contexto, direção e um guia que explique o que está acontecendo.</p>
      </div>

      <div className="divider"></div>

      {/* ── COMO FUNCIONA ── */}
      <section className="reveal">
        <div className="section-label">Como funciona</div>
        <h2>Simples como receber<br />uma <em>mensagem</em></h2>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">01</div>
            <h3>Você compra uma vez</h3>
            <p>Pagamento único de R$47. Sem mensalidade, sem renovação, sem surpresa. Acesso completo aos 365 dias.</p>
          </div>
          <div className="how-card">
            <div className="how-number">02</div>
            <h3>Todo dia às 7h chega uma mensagem</h3>
            <p>No WhatsApp mesmo. Com contexto histórico, os capítulos do dia, um ponto de atenção e uma oração curta.</p>
          </div>
          <div className="how-card">
            <div className="how-number">03</div>
            <h3>Você lê os capítulos do dia</h3>
            <p>Em média 15 minutos por dia. Com o guia na mão, você vai entender o que está lendo — e querer continuar.</p>
          </div>
          <div className="how-card">
            <div className="how-number">04</div>
            <h3>Em 1 ano, você terminou</h3>
            <p>1.189 capítulos. 39 livros do AT, 27 do NT. Em ordem cronológica histórica — a forma mais imersiva de ler.</p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ── PREVIEW DA MENSAGEM ── */}
      <div className="preview-section">
        <div className="preview-inner">
          <div className="preview-phone reveal">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-header">
                  <div className="phone-avatar">📖</div>
                  <div>
                    <div className="phone-contact">Bíblia em 1 Ano</div>
                    <div className="phone-status">online agora</div>
                  </div>
                </div>
                <div className="phone-messages">
                  <div className="message-bubble">
                    <strong>📅 Dia 1 de 365 — Jó</strong>
                    <div className="msg-sep"></div>
                    <strong>🌍 Contexto de hoje:</strong><br />
                    Jó é o livro mais antigo da Bíblia. Tudo que poderia dar errado, deu — em um único dia. Mas Jó não entendeu. Adorou assim mesmo.
                    <div className="msg-sep"></div>
                    <strong>📖 Leia agora:</strong> Jó 1–3<br />
                    ⏱ ~15 minutos
                    <div className="msg-sep"></div>
                    <strong>🔍 Atenção em:</strong><br />
                    Satanás não age sem permissão. Há um limite no caos.
                    <div className="msg-sep"></div>
                    <em>🙏 Senhor, que eu adore mesmo sem entender. Amém.</em>
                    <div className="msg-sep"></div>
                    📊 ░░░░░░░░░░ 0%<br />
                    <em>Bom estudo, João! 📚</em>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal">
            <div className="section-label">Exemplo real</div>
            <h2>Assim chega<br />todo <em>dia</em></h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--cream-dim)', marginBottom: '32px' }}>
              Cada mensagem tem tudo que você precisa para a leitura do dia. Contexto histórico para entender o que está lendo, a passagem exata, um ponto de atenção e uma oração relacionada ao texto.
            </p>

            <div className="features">
              <div className="feature">
                <div className="feature-icon">🌍</div>
                <div>
                  <h4>Contexto histórico</h4>
                  <p>O que estava acontecendo no mundo quando esse texto foi escrito.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">📖</div>
                <div>
                  <h4>Passagem do dia</h4>
                  <p>Exatamente quais capítulos ler e quanto tempo vai levar.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔍</div>
                <div>
                  <h4>Ponto de atenção</h4>
                  <p>O que observar durante a leitura para não perder os detalhes.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🙏</div>
                <div>
                  <h4>Oração do dia</h4>
                  <p>Uma oração curta conectada ao texto que você acabou de ler.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONQUISTAS ── */}
      <section className="reveal">
        <div className="section-label">Progresso</div>
        <h2>Cada livro concluído<br />é uma <em>conquista</em></h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--cream-dim)', maxWidth: '540px', marginBottom: '48px' }}>
          Ao terminar cada livro da Bíblia, você recebe uma mensagem especial de parabéns com sua barra de progresso. Pequenas vitórias que mantêm você na jornada.
        </p>

        <div className="achievement-card">
          <div className="achievement-bubble">
            <strong>🎉 Parabéns! Você concluiu GÊNESIS!</strong><br /><br />
            Do "no princípio" até os ossos de José sendo carregados com fé para a terra prometida. A fundação de toda a narrativa bíblica.<br /><br />
            📊 ░░░░░░░░░░ 8% concluído<br /><br />
            <em>28 dias consecutivos. Você está construindo um hábito poderoso! 💪</em>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ── DEPOIMENTOS ── */}
      <div className="testimonials-section">
        <div className="testimonials-inner reveal">
          <div className="section-label">Depoimentos</div>
          <h2>O que dizem quem<br />já <em>começou</em></h2>

          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p>"Tentei ler a Bíblia 3 vezes na vida e sempre parei. Com o contexto histórico do guia, pela primeira vez estou entendendo o que estou lendo — e não consigo parar."</p>
              <div className="testimonial-author">
                <strong>Ana Paula M.</strong>
                professora, 34 anos
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p>"A mensagem chega e eu já sei exatamente o que fazer. 15 minutos por dia. É o único hábito espiritual que consegui manter por mais de 30 dias consecutivos."</p>
              <div className="testimonial-author">
                <strong>Carlos R.</strong>
                engenheiro, 41 anos
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p>"O que me impressionou foi a profundidade. Não é só 'leia isso aqui.' É contexto, história, conexão com o presente. Parece que a Bíblia ficou viva."</p>
              <div className="testimonial-author">
                <strong>Fernanda L.</strong>
                empresária, 28 anos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRICING ── */}
      <div className="pricing-section" id="comprar">
        <div className="pricing-inner reveal">
          <div className="section-label" style={{ justifyContent: 'center' }}>Investimento</div>
          <h2>Um preço justo para<br />uma jornada de <em>365 dias</em></h2>

          <div className="pricing-card">
            <div className="pricing-badge">Pagamento Único</div>

            <div className="price"><sup>R$</sup>47</div>
            <p className="price-note">Acesso completo · Sem mensalidade · Para sempre</p>

            <ul className="price-features">
              <li>365 dias de guia diário pelo WhatsApp</li>
              <li>Contexto histórico de cada passagem</li>
              <li>Ponto de atenção para cada leitura</li>
              <li>Oração diária conectada ao texto</li>
              <li>Resumo semanal todo domingo</li>
              <li>Mensagens de conquista ao terminar cada livro</li>
              <li>Barra de progresso personalizada</li>
            </ul>

            <a href={MP_LINK} className="btn-primary btn-full">
              Quero começar agora
            </a>

            <p className="guarantee">🔒 Pagamento seguro via Mercado Pago</p>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="faq-section reveal">
        <div className="section-label">Dúvidas</div>
        <h2>Perguntas <em>frequentes</em></h2>

        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q} <span>{openFaq === i ? '−' : '+'}</span>
            </div>
            {openFaq === i && (
              <div className="faq-answer">{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── FOOTER CTA ── */}
      <div className="footer-cta">
        <h2 className="reveal">Comece hoje.<br />Termine em <em>1 ano.</em></h2>
        <p className="reveal">"A jornada de mil milhas começa com um único passo."</p>
        <a href="#comprar" className="btn-primary reveal">
          Começar minha jornada — R$ 47
          <span>→</span>
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <p>© 2025 Bíblia em 1 Ano · Todos os direitos reservados</p>
      </footer>
    </>
  )
}
