# Managerz

A comunidade em [managerz.com.br](https://managerz.com.br) onde country managers, product managers e business development managers se conectam, votam e se ajudam.

Leia tudo sem conta. Para votar, responder, abrir um problema ou um hotseat, entre.

## O que está no ar

- **Conversas** estilo fórum + Quora, com busca e categorias
- **Busca** com sugestões a partir de 2 caracteres; o termo é gravado no Supabase após 3s parado ou no Enter
- **Upvotes** e tópicos **em alta**
- **Hotseats** — você senta na cadeira, a mesa pergunta
- **Ranking** por votos em perguntas e respostas, com badges 🏆1 🏆A 🏆H
- **Compartilhar** pergunta e link (LinkedIn, X, copiar)

Conversas e votos ficam no navegador (localStorage). O histórico de buscas vai para o projeto Supabase `managerz`.

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre em [http://127.0.0.1:3847](http://127.0.0.1:3847).

A busca sugere a partir de 2 caracteres (categorias, pessoas, conversas e histórico). O termo só é gravado em `search_queries` depois de 3 segundos parado, ou na hora em que o formulário é enviado (Enter ou sugestão).

`.env.local` pode copiar `.env.example`. Sem as variáveis, o app usa a URL e a chave publishable do projeto `managerz` — o histórico continua sendo gravado.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase.
