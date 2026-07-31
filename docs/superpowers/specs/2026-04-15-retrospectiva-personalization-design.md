# Retrospectiva — personalização com conteúdo real

**Data:** 2026-04-15
**Status:** design aprovado, aguardando plano de implementação
**Contexto base:** continua de `2026-04-14-card5-retrospectiva-design.md` (spec original da retrospectiva)

## Motivação

Card 5 (Retrospectiva) tem 10 slides funcionando com placeholders. Léo passou 3 informações concretas pra incorporar:

1. **Primeiro encontro pessoal foi no cinema**, assistindo "O Porão". O pior filme de terror do ano. Nenhum dos dois lembra o enredo, os dois lembram da volta pra casa. Virou piada interna do casal.
2. **Fizeram só 2 viagens juntos**, ambas litoral: Ilhabela/SP (1ª) e Paraty/RJ (2ª). Adoram praia. O slide atual mostra 3 destinos genéricos (placeholder).
3. **Querem colocar mais fotos** na colagem do slide "Fotos guardadas". Hoje reusa 6 capas do `public/photos/player-covers/` (FOTO1-9.jpeg), que são as capas do SpotifyPlayerCard.

## Decisões do brainstorm

- **Cinema vira slide próprio** (não se funde ao "Onde começou") com vibe **piada interna**, estilo **pôster VHS parodiado**.
- **Viagens** ganham mini-mapa inline + número + lista (layout híbrido), paleta **turquesa oceânico** (ex-verde esmeralda).
- **Fotos guardadas** mantém layout (número herói + thumbs wallpaper), mas dobra o número de thumbs (6 → 12) e lê de pasta dedicada nova.
- **Número de fotos é hardcoded** (Léo edita manualmente em `content.ts` quando quiser). **Não é derivado da pasta** — seria forçado dumpar biblioteca inteira pra o número bater.

## Nova estrutura dos slides

De 10 → **11 slides** (adiciona "O Porão" na posição 3):

| # | ID | Componente | Duração | Status |
|---|---|---|---|---|
| 1 | intro | IntroStory | 6000 | existente |
| 2 | where-started | WhereStartedStory | 6000 | existente |
| 3 | **movie** | **MovieStory** | **6000** | **NOVO** |
| 4 | days | DaysTogetherStory | 5000 | existente |
| 5 | messages | MessagesStory | 5000 | existente |
| 6 | trips | TripsStory | 5000 | **refeito** |
| 7 | song | OurSongStory | 6000 | existente |
| 8 | photos | PhotosCountStory | 5000 | **ajustado** |
| 9 | fav-photo | FavPhotoStory | 7000 | existente |
| 10 | poster | PosterStory | 7000 | existente |
| 11 | whats-next | WhatsNextStory | 7000 | existente |

Duração total: ~65s (antes ~59s).

## Slide 3 — O Porão (novo)

### Vibe
Piada interna, pôster VHS parodiado. Surpreende o usuário depois do "Onde começou" — data séria seguida de piada deboche-afetuosa.

### Visual

- **Gradiente:** `linear-gradient(160deg, #2B0B38 0%, #110418 100%)` (roxo profundo → quase preto)
- **Radial bloom** top-center em `rgba(240, 168, 204, 0.25)` (rosa pálido, sutil)
- **Grain overlay** padrão (igual às outras stories, opacity 0.08, mix-blend-overlay)

### Layout

Conteúdo centralizado vertical e horizontal, largura `max-w-md`.

```
┌─────────────────────────────────────┐
│                      ● REC 01·03·25 │ ← top-right badge monospace
│                                     │
│          ESTREIA MUNDIAL            │ ← eyebrow uppercase
│                                     │
│           O PORÃO                  │ ← Georgia italic serif, huge, shadow rosa
│                                     │
│      o filme era ruim.              │ ← tagline duas linhas
│        a companhia não.                   │    italic dourado #F5C36A
│                                     │
│    ★ ★ ☆ ☆ ☆ ☆ ☆ ☆ ☆ ☆           │ ← rating 2/10 centralizado
│                                     │
└─────────────────────────────────────┘
```

### Tipografia

- **Eyebrow** "ESTREIA MUNDIAL": 11px, font-bold, uppercase, tracking 0.35em, cor `#F0A8CC`
- **Título** "O PORÃO": fonte `Georgia, serif` (forçada inline), font-black italic, tamanho responsivo (`text-[12vw] sm:text-[9vw] md:text-7xl`), text-shadow `3px 3px 0 #FF3D78` (offset rosa choque simulando impressão VHS)
- **Tagline:** duas linhas, 14-16px, italic, cor `#F5C36A` dourado, line-height apertado
- **Rating:** 10 estrelas espaçadas, 14px, opacity 0.7, dourado pras ativas + cinza pras inativas. Hardcoded 2/10 (★★ + 8 ☆).
- **Badge REC:** 10px, monospace, opacity 0.7, cor `#F0A8CC`, com `●` vermelho pulsante opcional (nice-to-have).

### Entrance cinética (Framer Motion)

| Elemento | Init | Animate | Delay | Duration |
|---|---|---|---|---|
| Badge REC | `{opacity:0}` | `{opacity:0.7}` | 0.2s | 0.6s |
| Eyebrow | `{opacity:0, y:-10}` | `{opacity:1, y:0}` | 0.3s | 0.6s |
| Título | `{opacity:0, scale:0.88}` | `{opacity:1, scale:1}` | 0.55s | 0.95s |
| Tagline | `{opacity:0, y:10}` | `{opacity:1, y:0}` | 1.15s | 0.7s |
| Rating | `{opacity:0}` | `{opacity:0.7}` | 1.6s | 0.6s |

Easing padrão do projeto: `[0.22, 1, 0.36, 1]`.

### Conteúdo editável

Adicionar em `components/retrospectiva/content.ts`:

```ts
movie: {
  date: "01·03·25",
  title: "O PORÃO",
  tagline1: "o filme era ruim.",
  tagline2: "a companhia não.",
  rating: 2, // de 10
  eyebrow: "ESTREIA MUNDIAL",
},
```

## Slide 6 — Viagens (refeito)

### Vibe
Praiano. Mini-mapa dá presença geográfica sem virar protagonista.

### Visual

- **Gradiente:** `linear-gradient(160deg, #2EC4CC 0%, #0E5A6B 55%, #031218 100%)` (turquesa → azul profundo)
- Radial bloom top-right em `rgba(180, 230, 255, 0.25)` (substitui bloom verde antigo)
- Grain overlay padrão

### Layout

```
┌─────────────────────────────┐
│ VIAGENS                     │ ← eyebrow
│                             │
│  02    [MAP]                │ ← row: número grande + mini-mapa SVG
│        [ping]               │
│        [ping]               │
│                             │
│ LITORAL SUDESTE               │ ← label (substitui "lugares novos juntos")
│                             │
│ ● Ilhabela, SP             │ ← bolinha coral
│ ● Paraty, RJ             │ ← bolinha amarelo-areia
└─────────────────────────────┘
```

### Mini-mapa (SVG inline)

Estilizado, não realista. Representa uma costa vertical com 2 pings.

- Viewport `80 × 100`, renderizado em ~`64px × 80px` (sm) / `80px × 100px` (md)
- Path esquerdo: linha curva simulando a costa (`<path d="M10,5 Q30,20 25,40 Q20,60 30,80 Q35,95 32,100" stroke="rgba(255,255,255,0.3)" fill="none"/>`)
- Área à esquerda em `rgba(255,255,255,0.05)` (faixa de terra)
- 2 círculos como pings + linha tracejada dourada conectando
- Ping Paraty (norte): `cy=40`, cor `#FFE07A`
- Ping Ilhabela (sul): `cy=75`, cor `#FF7A5A`
- Linha tracejada entre eles em `#FFE07A`, stroke-dasharray `2 2`

### Tipografia

- Eyebrow "VIAGENS": igual ao padrão das outras stories
- Número "02": tamanho responsivo (`text-[32vw] sm:text-[22vw] md:text-[16rem]`), font-black
- Label "LITORAL SUDESTE": 12-14px, font-bold, uppercase, tracking 0.25em, cor branca 70%
- Lista destinos: 20-24px (`text-2xl sm:text-3xl`), font-extrabold, branco; bolinha 8px colorida antes do nome

### Entrance

- Eyebrow: como padrão (delay 0.2s)
- Número 02: scale + fade (delay 0.4s)
- Mini-mapa: fade-in (delay 0.6s); pings aparecem staggered com um pulse sutil (delay 0.8s e 1.0s)
- Linha tracejada: `pathLength` 0 → 1 animando (delay 1.1s, duração 0.7s)
- Label: fade (delay 0.9s)
- Destinos: staggered (delay 1.1s + i×0.18s), coming from left

### Conteúdo editável

Reestruturar em `components/retrospectiva/content.ts`:

```ts
trips: {
  destinations: [
    { name: "Ilhabela, SP", color: "#FF7A5A" },
    { name: "Paraty, RJ", color: "#FFE07A" },
  ],
  label: "LITORAL SUDESTE",
},
```

(Antes era `string[]`. `TripsStory.tsx` precisa atualizar o `map` pra ler o objeto.)

## Slide 8 — Fotos guardadas (ajustado)

### Layout
Mantido: número "412+" gigante centralizado + thumbs como wallpaper animado. Só muda **quantas fotos** e **de onde vêm**.

### Mudanças

- **6 → 12 thumbs** flutuando no fundo
- Fotos lidas de **pasta nova** `public/photos/collage/` (separada de `player-covers/`)
- Convenção de nomes: `FOTO1.jpeg … FOTO12.jpeg` (Léo popula manualmente com fotos simbólicas)
- Número de fotos guardadas continua **hardcoded** em `content.ts` (`countLabel`), editável por Léo

### 12 posições (determinísticas, evita overlap com o número central)

Cada thumb tem `top/left/size/delay/rot` fixos. Pra dar variedade sem competir com o "412+" central, espalhar nas bordas e cantos, evitando a zona central ~30% em torno do número.

Posições sugeridas (percentual da tela):

| # | top | left | size | rot | delay |
|---|---|---|---|---|---|
| 1 | 6% | 4% | 92 | -8 | 0.20 |
| 2 | 10% | 72% | 106 | 6 | 0.28 |
| 3 | 24% | 6% | 82 | 10 | 0.36 |
| 4 | 28% | 80% | 88 | -6 | 0.44 |
| 5 | 44% | 2% | 94 | 4 | 0.52 |
| 6 | 48% | 76% | 100 | -10 | 0.60 |
| 7 | 66% | 4% | 90 | 8 | 0.68 |
| 8 | 70% | 78% | 96 | -4 | 0.76 |
| 9 | 84% | 8% | 84 | 6 | 0.84 |
| 10 | 86% | 64% | 92 | -8 | 0.92 |
| 11 | 18% | 40% | 70 | 12 | 1.00 |
| 12 | 78% | 40% | 70 | -12 | 1.08 |

Posições #11 e #12 são menores (70px) e ficam acima/abaixo do "412+" com menor opacity (0.35 vs 0.55) pra não brigar com a leitura.

### Conteúdo editável

Em `components/retrospectiva/content.ts`:

```ts
photos: {
  countLabel: "412+", // Léo edita manualmente quando quiser
  collage: [
    "/photos/collage/FOTO1.jpeg",
    "/photos/collage/FOTO2.jpeg",
    // … até FOTO12.jpeg
  ],
},
```

**Decisão:** lista explícita com 12 paths (não usar `Array.from` gerador). Motivo: Léo pode querer trocar o arquivo de uma posição específica sem precisar renomear arquivos no disco, e a lista explícita faz o diff de git ficar legível.

## Arquivos afetados

### Criar

- `components/retrospectiva/stories/MovieStory.tsx` — novo slide
- `public/photos/collage/.gitkeep` — pasta vazia; Léo popula com FOTO1-12.jpeg depois

### Modificar

- `components/retrospectiva/content.ts` — adicionar `movie`, reestruturar `trips.destinations` (string → objeto com cor), renomear/ampliar `photos.collage`
- `components/retrospectiva/storiesConfig.ts` — importar `MovieStory`, inserir `{ id: "movie", Component: MovieStory, durationMs: 6000 }` na posição 3
- `components/retrospectiva/stories/TripsStory.tsx` — refazer: nova paleta turquesa, layout híbrido (row número+mapa), nova lista com cor dinâmica, label "LITORAL SUDESTE"
- `components/retrospectiva/stories/PhotosCountStory.tsx` — 12 thumbs (de 6), ler de `RETRO_CONTENT.photos.collage`, nova tabela de posições

### Não muda

- Todos os outros stories (Intro, WhereStarted, DaysTogether, Messages, OurSong, FavPhoto, Poster, WhatsNext)
- `StoryPlayer.tsx`, `ProgressBars.tsx`, `globals.css`
- `lib/dates.ts`
- Assets existentes (`public/audio/`, `public/covers/`, `public/photos/player-covers/`, `public/photos/about-us.jpeg`)

## Critérios de validação

Todas as mudanças são visuais + conteúdo. Test plan manual (no browser):

1. `npm run build` passa verde, `npx tsc --noEmit` limpo
2. Retrospectiva abre com **11 slides**, barras de progresso no topo mostram 11 segmentos
3. Slide 3 é "O Porão": título Georgia italic com shadow rosa, rating 2/10 abaixo da tagline, badge "● REC 01·03·25" no canto superior direito
4. Slide 6 "Viagens": gradiente turquesa (sem verde), número "02", mini-mapa SVG à direita com 2 pings coloridos (coral + amarelo), linha tracejada conectando, lista com 2 destinos reais
5. Slide 8 "Fotos guardadas": 12 thumbs flutuando bem distribuídos (sem sobrepor o "412+"), fotos vêm de `/photos/collage/`
6. Crossfade de áudio + gestos (tap/hold/swipe/teclado) continuam funcionando
7. Slide 11 "O que vem aí" fica estático no fim, botão "voltar" fecha retrospectiva

## Fora de escopo

- Conteúdo textual final (destinos já ficam corretos aqui; outros placeholders em `content.ts` — verso da música, frase de encerramento, caption da foto favorita — Léo edita depois)
- Fotos reais na pasta `collage/` (Léo dropa depois; o build funciona mesmo com pasta vazia, só mostra thumbs quebradas)
- Refatorações de código não relacionadas às 3 mudanças
- Pulse vermelho animado no badge REC (nice-to-have, pode virar follow-up)
