import './globals.css'

export const metadata = {
  title: 'Palavra do Amanhecer – Comece o dia com Deus',
  description: 'Todo dia às 7h, a Palavra de Deus chega com o seu nome direto no WhatsApp. Versículo, reflexão e oração personalizada.',
  openGraph: {
    title: 'Palavra do Amanhecer',
    description: 'Todo dia às 7h, a Palavra de Deus chega com o seu nome direto no WhatsApp.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
