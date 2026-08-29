# Plano de produto — de presente a SaaS

Transformar o site de presente (hoje: conteúdo hardcoded, static export, um
casal só) num produto onde qualquer pessoa monta o seu, paga, e recebe um link.

## Decisões tomadas

| Eixo | Decisão | Por quê |
|---|---|---|
| Pagamento | Mercado Pago (Pix + cartão) | Pix é a maior fatia do e-commerce BR e tem a menor taxa; público do produto é brasileiro |
| Hosting | VPS self-hosted, Docker Compose | Custo fixo baixo, controle total |
| Banco | SQLite + Drizzle ORM | Volume de escrita baixíssimo (um registro por casal). Zero infra, backup = um arquivo. Trocar pra Postgres depois é um swap de dialeto no Drizzle |
| Storage | Volume local + `sharp` | Sem dependência de S3. Egress do VPS já está pago |
| Monetização | Pagamento único por site | Presente é compra pontual; assinatura teria churn absurdo |
| Identidade | Mantém o visual atual por ora | Validar venda primeiro. **Risco de trade dress do Spotify permanece em aberto** — revisitar antes de escalar marketing |

## Arquitetura

```
Internet → Caddy (TLS automático)
             └→ Next.js standalone (Node)
                  ├→ SQLite (volume ./data/app.db)
                  ├→ Uploads (volume ./data/uploads)
                  └→ Mercado Pago API
```

O `output: "export"` sai. Vira `output: "standalone"` — mesmo app, agora com
rotas de API e renderização por slug.

### Rotas

| Rota | O que é |
|---|---|
| `/` | Landing de vendas: demo, preço, prova social |
| `/criar` | Wizard de montagem (6 passos) |
| `/editar/[token]` | Volta pro rascunho — token secreto, sem login |
| `/checkout/[siteId]` | Mercado Pago |
| `/p/[slug]` | **O site publicado** — o app de hoje, alimentado por config |
| `/demo` | O site de exemplo com fotos de casal royalty-free |
| `/api/sites`, `/api/upload`, `/api/webhooks/mercadopago` | Backend |

### Sem autenticação

Ninguém cria conta. O fluxo é: rascunho anônimo → token secreto salvo em
localStorage e enviado por e-mail → esse token é a única chave de edição.
Remove uma superfície inteira de auth e é o padrão do nicho.

### Modelo de dados

```
sites   id · slug · editToken · status(DRAFT|PAID|PUBLISHED|EXPIRED)
        · ownerEmail · config(JSON) · plan · publishedAt · expiresAt
photos  id · siteId · slot · order · path · thumbPath · w · h · dominantColor
orders  id · siteId · plan · amountCents · status · mpPaymentId
        · mpPreferenceId · paidAt
```

O `config` é um blob JSON tipado (`SiteConfig`) — versionado, validado com Zod
na escrita. Deixa o schema de conteúdo evoluir sem migração de banco.

## Fases

Cada fase termina com o app rodando. Nada de "fase que quebra e a próxima
conserta".

### Fase 0 — Fundação
- `output: standalone`, deps novas (drizzle, zod, better-sqlite3, mercadopago)
- Schema + migrations do Drizzle
- Dockerfile multi-stage + compose (app + caddy) + `.env.example`
- **Saída:** app sobe igual a hoje, com banco vazio atrás

### Fase 1 — `SiteConfig` (a fase que destrava tudo)
- Tipo `SiteConfig` cobrindo 100% do que hoje é hardcoded: nomes, datas,
  carta, faixa, capas, galerias, os 11 slides da retrospectiva
- Refatorar **todo** componente pra ler de contexto em vez de constante
- `defaultConfig` = conteúdo atual do Léo & Ana → nada muda visualmente
- Site publicado passa a viver em `/p/[slug]`
- **Saída:** o mesmo site, agora sendo função de um objeto

### Fase 2 — Upload e storage
- `POST /api/upload`: valida tipo/tamanho, **remove EXIF** (GPS de foto de
  casal é dado sensível), redimensiona, gera thumb, extrai cor dominante
- Serving com cache imutável
- Cota por plano
- **Saída:** dá pra subir foto e ver na tela

### Fase 3 — Wizard
1. Nomes e datas · 2. Fotos (drag & drop, reordenar) · 3. Música (upload ou
catálogo curado) · 4. A carta · 5. Retrospectiva (slide a slide, cada um
desativável) · 6. Preview
- Autosave do rascunho a cada mudança
- **Saída:** um estranho consegue montar o site dele inteiro

### Fase 4 — Pagamento
- Planos e preços
- Checkout Mercado Pago (Pix + cartão), webhook idempotente
- Webhook pago → gera slug → publica → e-mail com os dois links
- **Saída:** dá pra vender

### Fase 5 — Landing
- Copy de vendas, preço, FAQ, demo ao vivo
- OG image por site (o link no WhatsApp precisa ser bonito)
- **Saída:** dá pra divulgar

### Fase 6 — Fotos e música royalty-free
- Fotos de casal (Pexels/Unsplash, licença livre pra uso comercial) pro demo
  e pros placeholders do wizard
- Catálogo de faixas instrumentais licenciadas
- **Saída:** o produto para de parecer um template vazio

### Fase 7 — Operação
- Backup do SQLite + uploads, job de expiração, painel admin, analytics
- **Saída:** dá pra dormir à noite

## Riscos em aberto

1. **Trade dress do Spotify** — decisão consciente de adiar. Antes de gastar
   com tráfego, redesenhar.
2. ~~**Música com direitos autorais**~~ — **resolvido na Fase 6.** As duas
   faixas comerciais saíram do repositório; a trilha agora é sintetizada por
   `scripts/gen-audio.mjs` e não tem titular de direitos.
3. **Conteúdo de terceiros** — usuários subindo fotos exige termos de uso e um
   canal de denúncia. Fase 7.
