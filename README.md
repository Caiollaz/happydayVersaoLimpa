# Happyday

Um produto que deixa qualquer pessoa montar um site de presente — fotos,
música, uma carta e uma retrospectiva em onze telas — pagar uma vez e receber
um link pra mandar no WhatsApp.

Nasceu como um presente de um ano feito à mão para uma pessoa só. O código
daquele presente ainda está aqui, mas agora tudo que era hardcoded virou um
objeto de configuração, e há um wizard, um checkout e um banco em volta dele.

## Rodando local

```bash
npm install
cp .env.example .env.local     # os defaults já servem pra desenvolver
npm run db:migrate             # cria ./data/app.db
npm run dev                    # http://localhost:3000
```

Sem `MP_ACCESS_TOKEN` o checkout responde 503 em vez de fingir que funciona.
Sem `SMTP_URL` o e-mail de entrega é logado no console em vez de enviado.

| Script | O que faz |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:migrate` | aplica as migrations do Drizzle |
| `npm run db:generate` | gera migration a partir do schema |
| `npm run artwork` | regera as 38 imagens do exemplo |
| `npm run audio` | regera as duas faixas instrumentais |

## As rotas

| Rota | O que é |
|---|---|
| `/` | landing de vendas |
| `/demo` | o site de exemplo, renderizado do `DEFAULT_CONFIG` |
| `/criar` | cria um rascunho e manda pro editor |
| `/editar/[token]` | o wizard de 6 passos |
| `/preview/[token]` | o rascunho como o visitante veria, com marca d'água |
| `/p/[slug]` | **o site publicado** |
| `/checkout/retorno` | volta do Mercado Pago |
| `/admin` | painel do operador |

## Como o conteúdo funciona

Todo o conteúdo de um site vive num único objeto serializável, o
[`SiteConfig`](lib/config/schema.ts), guardado como JSON numa coluna. Nenhum
componente tem texto fixo: eles leem de `useSiteConfig()`. É isso que faz um
mesmo código servir todo mundo.

Duas regras que o schema impõe e que valem saber:

- **Datas são strings `"AAAA-MM-DD"`, nunca `Date`.** Além do config precisar
  ser JSON, `new Date("2025-02-14")` parseia como UTC — no Brasil isso é dia
  13 às 21h, e todo contador de dias sairia errado por um.
- **Caminhos de asset são validados por regex.** Config é conteúdo de
  usuário; sem isso alguém aponta uma foto pra um domínio externo e vaza o IP
  de quem visita.

Em `retro.slides`, cada uma das onze telas tem seu próprio `enabled` — as
desligadas nem chegam a montar, e as barras de progresso se ajustam sozinhas.

## Sem autenticação

Ninguém cria conta. Um rascunho gera um `editToken` de 128 bits que é a única
credencial do produto: quem tem, edita. Ele viaja no path em `/editar` (é o
bookmark e o link do e-mail) e em header `x-edit-token` na API, pra não cair
nos logs de acesso.

## Fotos

Toda foto enviada passa por `sharp` antes de tocar o disco: rotação do EXIF
aplicada, imagem redimensionada, reencodada como JPEG — o que descarta o
bloco EXIF inteiro, **incluindo a coordenada de GPS**. São fotos de casal num
link que circula; essa informação não pode sobreviver ao upload.

O arquivo é nomeado pelo hash dos bytes já processados, então a URL nunca
muda de conteúdo e pode ser cacheada pra sempre.

## Assets do exemplo

Não há nenhuma foto real nem música de terceiros no repositório:

- As 38 imagens são cenas vetoriais desenhadas por `scripts/gen-artwork.mjs`.
- As duas faixas são sintetizadas por `scripts/gen-audio.mjs`.

Para trocar o exemplo por fotos de verdade, com licença comercial e crédito:

```bash
PEXELS_API_KEY=<sua chave> node scripts/fetch-photos.mjs
```

## Deploy (VPS)

```bash
cp .env.example .env      # preencha DOMAIN, MP_*, SMTP_URL, ADMIN_TOKEN
docker compose up -d      # app + Caddy com TLS automático
```

O container migra o banco antes de servir. Tudo que não dá pra reconstruir
vive em `./data` — o SQLite e os uploads.

Duas tarefas no cron do host:

```cron
0 3 * * * cd /srv/happyday && ./scripts/backup.sh >> /var/log/happyday-backup.log 2>&1
0 4 * * * curl -fsS -X POST -H "Authorization: Bearer $ADMIN_TOKEN" https://SEU-DOMINIO/api/admin/sweep
```

A primeira faz snapshot consistente do banco (`VACUUM INTO`, que não briga
com o WAL), verifica a integridade e guarda 14 dias. A segunda apaga
rascunhos parados há 30 dias e expira sites vencidos.

## Stack

Next.js 16 (App Router, standalone) · React 19 · TypeScript · Tailwind 3 ·
Framer Motion · Drizzle + SQLite · sharp · Zod · Mercado Pago · Caddy.

## Estado

Ver [PRODUCT.md](PRODUCT.md) pro plano e [PROGRESS.md](PROGRESS.md) pro que
está feito, o que falta e por quê.
