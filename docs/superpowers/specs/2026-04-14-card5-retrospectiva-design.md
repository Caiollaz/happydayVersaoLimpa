# Design — Card 5 Retrospectiva (Spotify Wrapped clone)

**Data:** 2026-04-14
**Autor:** Léo + Claude (brainstorm)
**Status:** aprovado, aguardando plano de implementação

---

## 1. Objetivo

Entregar a experiência real por trás do botão "Vamos lá" do `RetrospectivaCard`: uma sequência de 10 slides verticais estilo Instagram Stories / Spotify Wrapped, contando a história do primeiro ano de relacionamento de Léo e Ana de forma playful-stats (curva: hook → abertura → dados → clímax cultural/visual → fechamento emocional).

Escopo fora: tracking de analytics, versões shareable que não o slide Poster (print é suficiente), áudio alternativo além de "Harleys in Hawaii", tema claro/dark toggle.

## 2. Contexto

- **Já construído hoje:** `components/retrospectiva/StoryPlayer.tsx` (overlay full-screen + crossfade de áudio site→retro) + `components/retrospectiva/stories/IntroStory.tsx` (slide 1).
- **Áudio da retrospectiva:** `/audio/harleys-in-hawaii.mp3` (2:51 min). É a **música do casal** e protagoniza o slide "Nossa música".
- **Áudio do site:** `/audio/still-loving-you.mp3` (trilha do `SpotifyPlayerCard`, não aparece na retrospectiva — faz fade-out quando ela abre e fade-in quando fecha).
- **Datas do relacionamento:**
  - **14 de fevereiro de 2025** — se conheceram (usado no slide "Onde começou" e como origem do contador "Dias juntos")
  - **5 de abril de 2025** — pedido de namoro oficial (usado apenas no `CountdownTimer` do Card 2 "Sobre nós", como está hoje — **não muda**)
  - **5 de abril de 2026** — entrega do presente
- **Paleta autoritativa:** `spotify-*` tokens em `tailwind.config.ts`. Slides da retrospectiva usam gradientes custom por slide, com callback ao verde Spotify no Poster final como handshake visual.

## 3. Conteúdo — os 10 slides

Curva narrativa: **Hook → Abertura → Escalada de dados → Clímax cultural/visual → Fechamento emocional.**

| # | Slide | Fase | Duração | Gradiente | Conteúdo |
|---|---|---|---|---|---|
| 1 | Intro (já existe) | Hook | 6s | rosa/carmim/bordô | Eyebrow "Retrospectiva" + "Léo / e / Ana" stacked (e dourado) + subhead |
| 2 | Onde começou | Abertura | 6s | rosa escuro/bordô | Data `14.02.2025` em destaque + 1 frase de contexto (placeholder: "o dia que tudo começou") |
| 3 | Dias juntos | Dados | 5s | laranja/coral/carmim | Contador animado 0 → N (calculado de 14/fev/2025 até hoje; ~415 em 5/abr/2026) + sublabel "dias de nós dois" |
| 4 | Mensagens | Dados | 5s | âmbar/dourado | Contador animado 0 → **47.312** + sublabel "mensagens trocadas" |
| 5 | Viagens | Dados | 5s | verde esmeralda | Número "03" + lista dos destinos com stagger entrance (placeholder: "Lugar A / Lugar B / Lugar C") |
| 6 | Nossa música | Clímax | 6s | roxo/índigo | Capa de "Harleys in Hawaii" rotacionando estilo vinil + título + 1 verso icônico (placeholder) |
| 7 | Fotos juntos | Clímax | 5s | magenta/rosa | "412+" grande + colagem animada de 5–7 thumbs flutuando no fundo |
| 8 | Foto favorita | Pico emocional | 7s | cinza/preto (foto protagoniza) | UMA foto full-bleed + caption curta (placeholder: "esse olhar") + vinheta sutil |
| 9 | Poster final | Recap | 7s | verde Spotify | Card "2025 → 2026" estilo Wrapped com grid de highlights (415 dias · 47.3k mensagens · 3 viagens · Harleys in Hawaii) + nomes |
| 10 | O que vem aí | Fechamento | 7s | rosa → preto | Frase curta emocional (placeholder: "e isso foi só o começo.") + botão sutil "voltar pro site" que chama `onClose()` (mesmo efeito do X/swipe-down) |

**Total:** ~59s (audio Harleys in Hawaii tem ~171s, cabe folgado mesmo com pausa/replay).

**Conteúdo aberto (Léo edita durante a implementação):** slides 2 (frase de contexto), 5 (3 destinos), 6 (verso da música), 8 (foto + caption), 10 (frase final).

## 4. Arquitetura

### 4.1 Fonte única: `storiesConfig.ts`

Arquivo novo em `components/retrospectiva/storiesConfig.ts`.

```ts
import type { ComponentType } from "react";

export interface StoryProps {
  isActive: boolean;
}

export interface StoryConfig {
  id: string;
  Component: ComponentType<StoryProps>;
  durationMs: number;
}

export const STORIES: StoryConfig[] = [
  { id: 'intro',         Component: IntroStory,        durationMs: 6000 },
  { id: 'where-started', Component: WhereStartedStory, durationMs: 6000 },
  { id: 'days',          Component: DaysTogetherStory, durationMs: 5000 },
  { id: 'messages',      Component: MessagesStory,     durationMs: 5000 },
  { id: 'trips',         Component: TripsStory,        durationMs: 5000 },
  { id: 'song',          Component: OurSongStory,      durationMs: 6000 },
  { id: 'photos',        Component: PhotosCountStory,  durationMs: 5000 },
  { id: 'fav-photo',     Component: FavPhotoStory,     durationMs: 7000 },
  { id: 'poster',        Component: PosterStory,       durationMs: 7000 },
  { id: 'whats-next',    Component: WhatsNextStory,    durationMs: 7000 },
];
```

Adicionar/remover slides = editar esse array. O `StoryPlayer` itera por ele.

### 4.2 `StoryPlayer` — state machine

State interno:

```ts
const [currentIndex, setCurrentIndex] = useState(0);
const [isPaused, setIsPaused] = useState(false);
```

Comportamentos:
- Renderiza **apenas** a story em `currentIndex` (unmount das outras). Animações rodam do zero cada vez que a story é montada.
- A story ativa recebe `isActive={true}`. Prop existe por simetria/futuro — com unmount o valor é sempre `true` enquanto montada.
- Ao abrir (`open` vira `true`): reseta `currentIndex = 0`, `isPaused = false`. Áudio crossfade (já implementado) dispara.
- Ao fechar: mantém state (pode ser resetado na próxima abertura; o reset acontece no `useEffect` de `open`).

### 4.3 Progress bars

No topo do overlay, uma row de `N` barras (uma por story), gap pequeno. Cada barra:

- **Passada (index < current):** width 100%, full branco.
- **Ativa (index === current):** `motion.div` com `initial={{ width: "0%" }}`, `animate={{ width: "100%" }}`, `transition={{ duration: durationMs/1000, ease: "linear" }}`, `key={currentIndex}` pra forçar remount+restart. `onAnimationComplete` chama `next()`.
- **Futura (index > current):** width 0%, background branco translúcido (trilho).

Pause: usar `useAnimationControls` do framer-motion; `controls.start()` na entrada, `controls.stop()` no pause, `controls.start(...)` pra retomar. Alternativa mais simples: aplicar `animationPlayState` via style/class quando `isPaused` (se framer suportar — senão, controls é o caminho).

**Auto-advance via `onAnimationComplete`** em vez de `setInterval` — respeita pausa nativamente e é o padrão recomendado pelo próprio framer pra esse caso.

**Último slide:** `onAnimationComplete` não chama `next()` quando `currentIndex === STORIES.length - 1`. A barra fica cheia e a tela estática até Ana fechar ou apertar "voltar".

### 4.4 Gestos

Layer transparente `absolute inset-0 z-10` dividido em 3 zonas (flexbox `flex`):

```
┌─────────────┬───────────┬─────────────┐
│   PREV 30%  │  HOLD 40% │   NEXT 30%  │
└─────────────┴───────────┴─────────────┘
```

- **`onPointerDown`** em qualquer zona: salva timestamp em um ref, arma timer de 180ms que seta `isPaused = true` (isso é o "hold").
- **`onPointerUp`**:
  - Se o timer de 180ms ainda não disparou (soltou antes) → é **tap**. Cancela o timer. Olha a zona: esquerda = `prev()`, direita = `next()`, meio = ignora (neutralidade).
  - Se já disparou (é hold) → seta `isPaused = false` (resume).
- **`onPointerCancel` / `onPointerLeave`**: idem ao `onPointerUp` mas sempre resume, sem tap.
- **Swipe down:** envolver tudo num `motion.div` com `drag="y"`, `dragConstraints={{ top: 0, bottom: 0 }}`, `onDragEnd` → se `offset.y > 80` chama `onClose()`.

**Resolução do conflito hold-vs-drag:** quando um drag começa (framer dispara `onDragStart`), cancela o timer de 180ms do hold e reseta o estado — isso evita pausar a retrospectiva só porque o usuário está iniciando um swipe pra fechar.

Funções expostas internamente:
- `next()` — incrementa `currentIndex` (clamp ao último). Se já no último, no-op.
- `prev()` — decrementa (clamp ao 0). Se no primeiro, no-op.
- `pause()` / `resume()` — flag `isPaused`; afeta animation controls das barras E do áudio do retro.

Áudio durante pause: `audio.pause()` enquanto paused, `audio.play()` ao resumir. Volume fica como está (não re-crossfade).

### 4.5 Áudio — mudanças mínimas

O que já funciona:
- Crossfade site→retro ao abrir (`fadeOut` no `SpotifyPlayerCardHandle` + `fadeAudio(retroAudio, 1, 900ms)`)
- Crossfade retro→site ao fechar
- `audio` do retro permanece montado através do `open` toggle

O que adicionar:
- Integração com `isPaused` → pause/resume do `audioRef.current`

### 4.6 `Story.tsx` wrapper — opcional

Se o código ficar repetitivo entre stories, criar `Story.tsx` com variantes de entrance/exit compartilhadas. Caso contrário (provável, porque cada slide tem animação própria), cada story é só um componente isolado que recebe `StoryProps` e renderiza layout full-bleed. **Decisão:** não criar wrapper até haver repetição real. Começar sem.

## 5. Estrutura de arquivos

```
components/retrospectiva/
├── StoryPlayer.tsx              # refatorado (state machine + progress bars + gestos)
├── storiesConfig.ts             # NOVO — array de stories
├── ProgressBars.tsx             # NOVO — barras no topo, extraído pra legibilidade
└── stories/
    ├── IntroStory.tsx           # existe — adicionar prop isActive
    ├── WhereStartedStory.tsx    # NOVO
    ├── DaysTogetherStory.tsx    # NOVO
    ├── MessagesStory.tsx        # NOVO
    ├── TripsStory.tsx           # NOVO
    ├── OurSongStory.tsx         # NOVO
    ├── PhotosCountStory.tsx     # NOVO
    ├── FavPhotoStory.tsx        # NOVO
    ├── PosterStory.tsx          # NOVO
    └── WhatsNextStory.tsx       # NOVO
```

Datas do relacionamento centralizadas onde já moram hoje (`app/page.tsx` passa via props ou constante compartilhada em `lib/`). Proposta: mover `RELATIONSHIP_START` (5/abr) + adicionar `COUPLE_MET_DATE` (14/fev) em `lib/dates.ts` pra ficar acessível às stories sem prop-drilling.

## 6. Assets necessários

| Asset | Status | Onde |
|---|---|---|
| Capa da música (arte gerada por `scripts/gen-artwork.mjs`) | ✅ gerada | `public/covers/nossa-cancao.jpg` |
| 5–7 fotos pra colagem do slide "Fotos juntos" | ♻️ reusar | fotos já existentes em `public/photos/player-covers/FOTO{1..9}.jpeg` |
| Foto favorita (slide 8) — vertical, funciona full-bleed | ❌ Léo escolhe | `public/photos/fav.jpeg` |

Implementação começa com placeholder: a capa pode ser um gradiente rotativo até o arquivo real entrar; a foto favorita pode usar uma das `FOTO{1..9}` até Léo escolher a definitiva.

## 7. Placeholders de texto (Léo edita na implementação)

Centralizar placeholders num único `components/retrospectiva/content.ts` pra facilitar edição:

```ts
export const RETRO_CONTENT = {
  whereStarted: { context: "o dia que tudo começou" },
  trips: { destinations: ["Destino A", "Destino B", "Destino C"] },
  song: { verse: "rolling up like..." },
  favPhoto: { src: "/photos/fav.jpeg", caption: "esse olhar" },
  whatsNext: { phrase: "e isso foi só o começo." },
};
```

Léo edita esse arquivo (uma vez, tudo num lugar) quando o conteúdo definitivo estiver pronto.

## 8. Integração com o app atual

- `RetrospectivaCard` e `app/page.tsx`: **zero mudança** (botão já dispara `onStart` → `setRetroOpen(true)` → `<StoryPlayer open={retroOpen} … />`).
- `SpotifyPlayerCardHandle` e `fadeAudio`: **zero mudança**, já têm o contrato correto.
- Nova dependência de código: `lib/dates.ts` importado por stories que precisam das datas.

## 9. Performance

- Stories são unmounted quando não ativas → sem overhead de animações em background.
- Imagens já são servidas do `public/` com static export; Next `<Image />` não é usado (política do projeto).
- Collage do slide 7 usa as mesmas fotos já cacheadas no browser (reuso dos covers do player).
- `useMotionValue` + `animate()` pros contadores rodam em rAF, não bloqueiam main thread.

## 10. Testing

Projeto não tem suíte de testes (é presente pessoal, one-shot). Validação é **manual no navegador** seguindo o "golden path":

1. Carrega a home → clica no Anchor CTA → player toca.
2. Scroll até Card 5 → clica "Vamos lá" → retro abre, áudio do site faz duck, Harleys in Hawaii entra.
3. Intro anima, progress bar enche, auto-avança pro slide 2.
4. Tap na esquerda → volta. Tap na direita → avança. Hold no meio → tudo pausa (barra + áudio).
5. Swipe pra baixo → fecha. Áudio do site volta.
6. ESC → fecha.
7. Abre de novo → começa do slide 1 (reset de estado).
8. Chega no último slide → para (não fecha sozinho).

## 11. O que NÃO está neste escopo

- Testes automatizados (não existe infra no projeto).
- Analytics / tracking de engajamento.
- Versões shareable programáticas além do Poster visual (screenshot já resolve).
- Fotos/textos definitivos (vêm durante a implementação conforme Léo fornece).
- Refactor do `SpotifyPlayerCard` ou de outros cards do site.

## 12. Perguntas fechadas neste brainstorm

1. **Tom:** Playful/Stats (vs Emotional ou Hybrid).
2. **Categorias (9):** Dias juntos · Onde começou · Viagens · Nossa música · Mensagens · Fotos · Foto favorita · Poster · O que vem aí.
3. **Ordem:** como definida na tabela da seção 3.
4. **Duração:** 5s dados / 6s culturais / 7s emocionais.
5. **Datas:** 14/fev = início, 5/abr = namoro oficial. "Dias juntos" conta a partir de 14/fev.
6. **Música:** Harleys in Hawaii é a música do casal e já toca durante a retrospectiva.
7. **Progress bar:** sempre visível no topo.
8. **Gestos:** tap esquerda/direita navega, hold pausa, swipe down fecha.
9. **Último slide:** fica estático, não fecha sozinho.
10. **Conteúdo aberto:** placeholders em `content.ts`, Léo edita durante a implementação.
