# Progresso

Arquivo vivo. Cada iteração do loop lê isto, faz o próximo item pendente,
marca, e anota o que aprendeu. Ver [PRODUCT.md](PRODUCT.md) pro plano.

**Estado atual:** todas as 7 fases feitas · 2 itens dependem de credenciais suas
**Última atualização:** 2026-08-28

---

## Fase 0 — Fundação ✅
- [x] Instalar deps
- [x] `output: export` → `standalone`
- [x] Adicionar drizzle-orm, better-sqlite3, zod, mercadopago, nodemailer, sharp, server-only
- [x] Schema Drizzle (sites, photos, orders) + migration inicial (`drizzle/0000_pink_the_hunter.sql`)
- [x] `lib/db/index.ts` — conexão singleton (WAL, foreign_keys, busy_timeout)
- [x] `.env.example` + `lib/env.ts` (validado com Zod)
- [x] Dockerfile multi-stage + docker-compose.yml + Caddyfile + entrypoint
- [x] `GET /api/health` — probe que toca o banco
- [x] Verificar: build passa, standalone sobe, `/api/health/` → `{"ok":true}`

## Fase 1 — SiteConfig ✅
- [x] `lib/config/schema.ts` — `SiteConfig` + Zod (só JSON, datas como "AAAA-MM-DD")
- [x] `lib/config/default.ts` — conteúdo do Léo & Ana, valida contra o schema
- [x] `lib/config/context.tsx` — `useSiteConfig()`, `useText()`, `useDates()`
- [x] Refatorar cards: Anchor, AboutUs, Message, MiniCards, Retrospectiva
- [x] `components/ui/Highlight.tsx` — `*asterisco*` marca a palavra em destaque
- [x] Refatorar os 11 stories + storiesConfig + StoryPlayer
- [x] `content.ts` e `lib/dates.ts` deletados
- [x] `components/SiteExperience.tsx` — a experiência inteira, sem props
- [x] `/p/[slug]` (banco) · `/demo` (default) · `/` redireciona pro demo
- [x] `lib/sites.ts` — busca por slug e por editToken
- [x] Verificar: build passa; `/demo` tem os 24 textos do site original; site
      publicado no banco renderiza casal diferente sem vazar o default;
      `og:image` absolutiza com `APP_URL`; robots noindex

## Fase 2 — Upload e storage ✅
- [x] `lib/plans.ts` — planos, preços em centavos, cotas
- [x] `lib/storage.ts` — pipeline sharp: parse → rotate → resize → JPEG → hash
- [x] `POST /api/upload` — auth por editToken, cota, validação
- [x] `GET /api/media/[...path]` — stream + cache imutável de 1 ano
- [x] `lib/cleanup.ts` — varre rascunhos parados há 30d, expira sites vencidos
- [x] Verificar (servidor real, imagem real):
      3000×1000 com orientation 6 → **667×2000** (rotação aplicada);
      EXIF `Copyright`/`Artist`/GPS → **zero bytes sobreviveram**;
      cor dominante `#c83858` bate com a origem;
      traversal: 5 payloads bloqueados, `/etc/passwd` inacessível;
      token errado → 404, sem token → 401, não-imagem → 400;
      61ª foto com limite 60 → **409**

## Fase 3 — Wizard ✅
- [x] `POST /api/sites` — cria rascunho, devolve editToken
- [x] `GET`/`PATCH /api/sites/[id]` — autosave, auth por header `x-edit-token`
- [x] `lib/drafts.ts` — merge profundo (objetos mesclam, **arrays substituem**)
- [x] `lib/tokens.ts` — editToken de 128 bits, slug com acentos dobrados
- [x] `lib/wizard/useDraft.ts` — estado local otimista, debounce 700ms
- [x] Shell do wizard (6 passos, trilha clicável, indicador de salvamento)
- [x] Passo 1: nomes e datas · 2: fotos (upload, reordenar, capa) ·
      3: música · 4: carta · 5: retrospectiva slide a slide · 6: prévia
- [x] `/criar` · `/editar/[token]` · `/preview/[token]` com marca d'água
- [x] Verificar (ponta a ponta, servidor real):
      `/criar` → editor; wizard renderiza os 6 passos;
      patch de 1 slide preserva os outros 10;
      array substitui (9 capas → 1);
      proto pollution bloqueada;
      upload → URL passa no schema → aparece na prévia → serve 200;
      token inválido → 404 em `/editar` e `/preview`

## Fase 4 — Pagamento ✅
- [x] `lib/plans.ts` (feito na Fase 2)
- [x] `lib/mercadopago.ts` — Checkout Pro + verificação de assinatura HMAC
- [x] `lib/publish.ts` — aloca slug, publica, **idempotente**
- [x] `lib/mail.ts` — e-mail de entrega com os dois links
- [x] `POST /api/checkout` + botão de pagamento no passo 6
- [x] `POST /api/webhooks/mercadopago` — assinado, idempotente
- [x] `/checkout/retorno` — lê o pedido no banco, não a query string
- [x] Verificar:
      10/10 casos de assinatura (adulterada, segredo errado, replay de
      data.id, replay de request-id, ts de 20min, header lixo, sem v1);
      assinatura válida passa o portão (500 no fetch = credencial ausente);
      publishSite 2× → mesmo slug; colisão → sufixo distinto;
      checkout: sem token 401, e-mail inválido 400, plano inexistente 400,
      Básico com retro ligada 409, sem MP_ACCESS_TOKEN 503
- [ ] **Pendente:** fluxo real em sandbox do MP (precisa de credenciais suas)

## Fase 5 — Landing ✅
- [x] `/` — hero, o que a pessoa recebe, como funciona, preços, 8 perguntas, CTA final
- [x] `/demo` já existia (Fase 1)
- [x] OG image dinâmica por site (`app/p/[slug]/opengraph-image.tsx`)
- [x] **Removido `trailingSlash: true`** — quebrava a OG image
- [x] Verificar: landing renderiza os 14 blocos de copy; **nenhuma prova
      social fabricada**; OG image = PNG real 1200×630 (88 KB), inspecionada
      visualmente; meta tags og+twitter completas; regressão de 13 rotas
      depois da mudança de config

## Fase 6 — Fotos e música royalty-free 🟡
- [x] **Removidos** `still-loving-you.mp3` (Scorpions) e
      `harleys-in-hawaii.mp3` (Katy Perry) — 15 MB de material com direitos
- [x] `scripts/gen-audio.mjs` — sintetiza duas trilhas instrumentais do zero
      (`nossa-cancao.mp3` 116s, `retrospectiva.mp3` 108s, 128 kbps)
- [x] Capa renomeada: `harleys-in-hawaii.jpg` → `nossa-cancao.jpg`
      (o arquivo já era artwork gerado; só o nome referenciava a música)
- [x] `default.ts` e o catálogo do wizard apontam pro áudio novo
- [x] Verificar: demo serve o áudio novo (200), o antigo dá **404**;
      nível médio -14,4 dB, pico -3,4 dB (nem mudo nem estourado);
      wizard lista o catálogo novo
- [x] `scripts/fetch-photos.mjs` escrito — 38 slots, queries priorizando
      enquadramentos não-identificáveis, gera `CREDITS.md`
- [ ] **BLOQUEADO:** rodar o fetch. O Pexels exige `PEXELS_API_KEY`
      (grátis em pexels.com/api). Uma URL respondia 200 sem chave, mas era
      cache do sandbox — todas as outras dão 401. O demo segue com o
      artwork gerado, que é 100% limpo, só menos chamativo.

## Fase 7 — Operação ✅
- [x] `scripts/backup.sh` — `VACUUM INTO` + integrity_check + tar dos uploads,
      retenção de 14 dias
- [x] `lib/admin.ts` — token único, comparação em tempo constante
- [x] `POST /api/admin/sweep` — chamado pelo cron do host
- [x] `/admin` — receita, publicados, rascunhos, conversão, pedidos, sites
- [x] `/termos` e `/privacidade` + canal de denúncia
- [x] README reescrito pro produto (rotas, deploy, cron)
- [x] Analytics: **nenhum**. O funil sai das tabelas `sites` e `orders`
- [x] Verificar:
      backup **restaurado** — 14 sites, 3 fotos, integrity ok, casal certo,
      6 arquivos de upload extraídos;
      sweep apagou rascunho de 40 dias + fotos em cascade + arquivos do
      disco + expirou site vencido → `{"drafts":1,"expired":1}`;
      site EXPIRED passa a dar **404**, publicado segue 200;
      admin: sem cookie não vaza nada, com cookie mostra dados reais;
      token quase-certo (1 char a mais) → 401

---

## Log de decisões

- **2026-08-28** — SQLite em vez de Postgres. VPS único, escrita baixa, backup
  trivial. Drizzle deixa a migração pra Postgres barata se precisar.
- **2026-08-28** — Sem autenticação. Token secreto por rascunho, guardado em
  localStorage e enviado por e-mail.
- **2026-08-28** — `config` como blob JSON validado por Zod, não colunas.
  Schema de conteúdo evolui sem migração.

## O que falta (depende de você)

1. **Credenciais do Mercado Pago** — `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET`.
   Sem elas o checkout responde 503 honestamente. Todo o resto do fluxo está
   testado até o limite possível.
2. **Chave do Pexels** — `PEXELS_API_KEY=... npm run photos` troca o artwork
   gerado por fotos reais de casal com licença comercial.
3. **SMTP** — sem `SMTP_URL` o e-mail de entrega é logado, não enviado.
4. **Testar o Docker** — não está instalado nesta máquina; o Dockerfile e o
   compose nunca subiram de fato.
5. **Trade dress do Spotify** — segue em aberto por decisão sua. Vale
   revisitar antes de gastar com tráfego.

## Aprendizados / travas

- **Next 15.5.15 → 16.3.3.** A versão antiga tinha ~19 advisories high (SSRF,
  cache poisoning, XSS). Presente pessoal aguenta; produto exposto não.
- **sharp 0.34.5 → 0.35.4.** GHSA high em `<0.35.0`, e sharp é exatamente o
  que vai processar imagem enviada por usuário anônimo. Também saiu de
  devDependencies pra dependencies — é runtime agora.
- **4 moderate restantes** são `drizzle-kit` → `esbuild`, ferramenta de dev
  que nunca roda em produção. Corrigir exigiria voltar o drizzle-kit pra
  0.18. Aceito conscientemente.
- **`scripts/migrate.mjs` não importa `lib/db`.** Aquele módulo é Next-only
  (`server-only` + alias `@/`) e explodia sob `node` puro. Migração abre a
  própria conexão.
- **`trailingSlash: true`** faz `/api/health` responder 308. O healthcheck do
  compose usa a barra final.
- **Faltando pra deploy real:** Docker não está instalado nesta máquina, então
  Dockerfile e compose estão escritos mas **não foram testados de fato**.
  Validar no VPS antes de confiar.
- **Datas como string "AAAA-MM-DD", não `Date`.** O config vira JSON no banco.
  E `new Date("2025-02-14")` parseia como UTC — no Brasil isso é dia 13 às
  21h, o que deixaria todo contador de dias errado por um. `parseLocalDate`
  quebra a string em partes.
- **Caminhos de asset são validados por regex** (`/photos`, `/covers`,
  `/audio`, `/api/media`). Config é conteúdo de usuário: sem isso alguém
  aponta uma foto pra um domínio externo e vaza o IP de quem visita.
- **`*asterisco*` marca destaque** nos títulos. O headline original tinha
  "presente" num span verde; como JSX o destaque seria fixo pra sempre, como
  texto puro seria perdido. O marcador é a única versão que o wizard
  consegue deixar o usuário mover.
- **Slides desativados não montam.** `StoryPlayer` filtra por
  `slides[id].enabled` antes de contar, então as barras de progresso e os
  índices de swipe batem com o que está na tela.
- **Não verificado visualmente:** os 11 slides da retrospectiva só abrem por
  interação, então o teste cobriu typecheck + wiring, não o render. Abrir num
  navegador antes de considerar a Fase 1 100% fechada.
- **`.rotate()` tem que vir ANTES de reencodar.** EXIF de orientação é o que
  faz foto de celular sair deitada. Aplicar a rotação e só então descartar o
  metadado é a ordem que funciona; invertido, toda foto em retrato quebra.
- **sharp não copia metadado por padrão**, então o EXIF some sozinho — mas
  isso é o que mais importa aqui: são fotos de casal num link que circula, e
  o bloco EXIF carrega **a coordenada GPS da casa da pessoa**.
- **Nome do arquivo = hash dos bytes já processados.** URL nunca muda de
  conteúdo, então `immutable` de 1 ano é seguro e re-upload deduplica sozinho.
- **`resolveUploadPath` testada isoladamente**, não só via HTTP — o router do
  Next já normaliza `..` antes de chegar na rota, o que mascararia uma guarda
  quebrada. Um caso "permitido" (`....//....//etc/passwd`) resolve pra um
  diretório literal `....` **dentro** do UPLOAD_DIR: não é escape, só 404.
- ~~Dívida da Fase 3: `about.subtitle`~~ **resolvido** — o passo 1 regenera
  "Juntos desde <ano>" quando a data de início muda.
- **Rascunho novo começa como o site de exemplo, não em branco.** Um config
  vazio falharia o schema em todo passo (galeria exige ≥1 foto) e mostraria
  prévia quebrada até o fim. Começando de um site que funciona, a prévia é
  viva desde a primeira tela e todo campo é uma edição, não uma página em
  branco — e mantém **um** schema estrito em vez de dois.
- **Merge profundo, arrays substituem.** Assimetria proposital: patch em
  `galleries` significa "esta é a lista nova", e mesclar array por índice
  tornaria impossível remover foto. A regra é a mesma no cliente e no
  servidor — se divergissem, a prévia mostraria coisa diferente do que salva.
- **`keepalive` em vez de `sendBeacon`** pro save de última hora. `sendBeacon`
  não aceita header, o que forçaria o editToken na query string e portanto em
  todo log de acesso do caminho.
- **Reordenar foto é botão de seta, não drag.** Drag exige ponteiro; esses
  sites são montados no celular. Seta funciona com polegar, teclado e leitor
  de tela de graça.
- **Zero analytics, de propósito.** O funil que uma compra única precisa
  (rascunhos → pagos → publicados) já está implícito nas linhas que o produto
  guarda pra funcionar. Colocar pixel seria coletar dado a mais sobre gente
  montando um presente privado — e obrigaria a um banner de cookie.
- **Sweep é endpoint, não intervalo em processo.** Um `setInterval` dentro do
  servidor rodaria uma vez por réplica e dispararia de novo a cada restart.
  Cron do host chamando a rota é idempotente e observável.
- **`VACUUM INTO`, não `cp app.db`.** Copiar o arquivo direto corre contra o
  WAL e pode gerar um backup que abre mas perdeu as últimas transações.
  E o script roda `integrity_check` antes de confiar — backup não verificado
  é palpite.
- **A trilha é sintetizada, não licenciada.** Buscar música "royalty-free"
  de uma fonte qualquer é confiar na procedência dela; áudio escrito por
  `gen-audio.mjs` não tem titular de direitos pra discordar. Duas peças
  instrumentais determinísticas (Am–F–C–G e C–G–Am–F), pluck sintetizado +
  pad + delay barato como reverb.
- **Queries de foto evitam rosto de propósito.** A licença Pexels cobre uso
  comercial mas **não** concede model release, e pede que você não sugira
  que as pessoas retratadas endossam seu produto. Apresentar um casal real e
  reconhecível como o casal fictício do produto encosta nessa linha; uma
  silhueta não. E funciona melhor: rosto de banco de imagem convida
  comparação, silhueta convida projeção.
- **`trailingSlash: true` quebrava a OG image.** Era herança do static
  export. O Next emite `og:image` como `/opengraph-image?<token>` — uma
  chave de query sem valor — e o redirect pra forma com barra reescrevia pra
  `?<token>=`, que então falhava. Num servidor Node o flag não compra nada, e
  a OG image é a primeira coisa que a pessoa vê no WhatsApp. Removido.
- **Satori exige `display` explícito** em qualquer elemento com mais de um
  filho, e não tem cascata pra herdar. `{a} & {b}` são três filhos — vira uma
  template string única.
- **A OG image é desenhada, não a foto do casal.** A foto apareceria na lista
  de conversas do WhatsApp e estragaria a surpresa antes de abrir o link —
  além de vazar pra qualquer cache de preview no caminho.
- **Landing sem depoimento, sem contador de clientes, sem estrela.** O
  produto não tem cliente ainda; inventar prova é desonesto e é o jeito mais
  rápido de perder a confiança de que essa compra depende. O demo faz o
  trabalho — é a prova mais forte que existe, porque *é* o produto.
- **`PAID` e `PUBLISHED` separados valeu a pena.** O webhook marca pago e
  publica em passos distintos; se o e-mail falhar, o site já está no ar e
  ninguém é cobrado de novo. Falha de e-mail é logada, não propagada — senão
  o MP reentregaria e re-executaria tudo.
- **O corpo do webhook não decide nada.** Ele traz um id; o status que
  autoriza publicar é buscado de volta na API do MP autenticado.
- **Retorno do checkout lê o banco, não a query string.** A URL de volta é
  controlável por quem quiser; só o webhook publica de fato.
- **`RESERVED` em `slugifyNames` é praticamente morto.** O slug sempre vira
  "a-e-b" com dois nomes não-vazios (que o schema exige), e slugs vivem sob
  `/p/`, então nunca colidem com rota. Fica como seguro barato.
- **Boleto excluído do checkout.** Presente tem data; um pagamento que leva
  3 dias úteis pra compensar chega depois do aniversário.
- **Token no path em `/editar`, em header na API.** O path é o bookmark e o
  link que vai por e-mail; a API não tem esse motivo, então usa header e fica
  fora dos logs.
