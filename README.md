# 🌅 Palavra do Amanhecer – Next.js

## Estrutura do projeto

```
app/
  page.jsx              → Landing page (React)
  layout.jsx            → Layout raiz
  globals.css           → Estilos globais
  sucesso/page.jsx      → Página pós-pagamento
  api/webhook/route.js  → Webhook do Mercado Pago
.env.example            → Variáveis de ambiente necessárias
```

## Como rodar localmente

```bash
npm install
cp .env.example .env.local
# preencha o .env.local com suas chaves
npm run dev
```

Acesse http://localhost:3000

## Deploy na Vercel (recomendado)

1. Suba o projeto no GitHub
2. Acesse vercel.com → New Project → importe o repositório
3. Em **Environment Variables**, adicione todas as variáveis do `.env.example`
4. Clique em **Deploy**

## Configurar webhook no Mercado Pago

Após o deploy, copie a URL do projeto (ex: `https://palavradoamanhecer.vercel.app`) e:

1. Acesse o [Painel de Developers do MP](https://www.mercadopago.com.br/developers/panel)
2. Vá em **Webhooks → Configurar notificações**
3. URL: `https://SEU_DOMINIO/api/webhook`
4. Eventos: marque **Pagamentos** e **Assinaturas**
5. Copie o **Secret** gerado e coloque em `MP_WEBHOOK_SECRET` no .env

## Fluxo completo

```
Usuário clica em assinar
  → Vai para checkout do Mercado Pago
  → Pagamento aprovado
  → MP dispara POST para /api/webhook
  → Webhook valida assinatura
  → Cadastra no Supabase
  → Envia mensagem de boas-vindas via Evolution API
  → Usuário recebe devocional todo dia às 7h pelo n8n
```
