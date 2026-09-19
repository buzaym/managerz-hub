# Managerz

A mesa dos gestores. Comunidade em [managerz.com.br](https://managerz.com.br) para quem lidera pessoas: troca de ideias, hotseats, resolução de problemas, agenda entre pares, webinars e um marketplace de serviços (e trocas de hora).

Esta versão é um primeiro recorte navegável, em português, com dados de demonstração salvos no navegador. Você entra como **Camila Ribeiro**, Head of People da Leme Pay.

## O que já funciona

- **Mesa** — pulso da comunidade, hotseat ao vivo e atalhos
- **Ideias** — publicar, votar e responder
- **Hotseats** — confirmar presença e fazer perguntas
- **Problemas** — trazer um caso, responder, marcar o que ajudou
- **Agenda** — marcar 1:1 entre pares (horário de Brasília)
- **Webinars** — inscrever-se nas sessões
- **Marketplace** — anunciar serviço ou troca, enviar pedido
- **Membros** — círculo inicial e restauração dos dados de demo

## Como rodar

```bash
npm install
npm run dev
```

Abre em [http://127.0.0.1:4317](http://127.0.0.1:4317).

```bash
npm run build
npm start
```

## Domínio

O produto aponta para **managerz.com.br**. Configure o domínio no provedor de hospedagem (por exemplo Vercel) quando for publicar.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS e shadcn/ui.
