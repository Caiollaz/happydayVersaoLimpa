# happyday-public

Um presente de 1 ano em forma de site: um clone da experiência do Spotify
(tela "Now Playing", cards, e uma retrospectiva estilo Spotify Wrapped em 11
slides verticais).

Esta é a **versão pública** do projeto — mesma engenharia, mesma direção de
arte, mas com um casal fictício (Léo & Ana), textos próprios e imagens
geradas por código. Não há nenhuma foto ou informação pessoal aqui, então ela
pode ser publicada, forkada e usada como base pra fazer a sua própria.

## Rodando

```bash
npm install     # node_modules já vem incluso; rode só se precisar reinstalar
npm run dev     # http://localhost:3000
npm run build   # gera o site estático em ./out
```

O build usa `output: "export"` — o resultado em `out/` é HTML/CSS/JS estático,
serve em qualquer lugar (GitHub Pages, Netlify, Vercel, S3, um Apache velho).

## Onde mexer pra fazer a sua versão

Quase todo o conteúdo mora em quatro lugares:

| Arquivo | O que controla |
|---|---|
| [`components/retrospectiva/content.ts`](components/retrospectiva/content.ts) | Todo o texto e os números da retrospectiva — o filme, as viagens, a música, as contagens, as legendas |
| [`lib/dates.ts`](lib/dates.ts) | As datas (quando se conheceram, início do namoro, data do presente). Alimentam os contadores |
| [`app/page.tsx`](app/page.tsx) | A carta, os nomes, e quais fotos entram em cada galeria |
| [`scripts/gen-artwork.mjs`](scripts/gen-artwork.mjs) | As imagens. Troque por fotos de verdade e este script vira desnecessário |

Os nomes (`Léo`, `Ana`) aparecem também em `AnchorCard`, `AboutUsCard`,
`MessageCard`, `MessageModal`, `MiniCardsSection`, `IntroStory` e
`PosterStory` — é a única coisa espalhada pelo código.

## As imagens

Não há fotografias no repositório. Cada slot de foto é uma **cena vetorial
desenhada por código** e rasterizada pra JPEG:

```bash
npm run artwork   # regenera as 39 imagens em public/
```

As cenas são determinísticas (mesma seed, mesma imagem), então rodar de novo
não embaralha a galeria. Cada uma corresponde ao que aquele momento é: o
cinema no slide do filme ruim, o pôr do sol na praia da primeira viagem, os
dois cafés na foto favorita.

Isso também mantém o `useImagePalette` funcionando — ele extrai a cor
dominante de cada imagem em runtime pra pintar o fundo do player, e uma cena
com paleta real dá um resultado tão bom quanto uma foto.

**Pra usar fotos de verdade:** dropar os arquivos por cima, mantendo os
caminhos em `public/photos/`. Nenhum código muda.

## Áudio

`public/audio/` contém as duas faixas usadas (a do site e a da retrospectiva).
São arquivos de música comercial — se for publicar, troque por algo que você
tenha direito de distribuir.

## Stack

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind 3 ·
Framer Motion · lucide-react. Sem backend, sem banco, sem tracking.

## Estrutura

```
app/                      layout + página única (todos os cards empilhados)
components/
  cards/                  os 5 cards da home
  layout/                 CardContainer (espaçamento + entrada em scroll)
  modals/                 full-screen, carta, carrossel de fotos
  retrospectiva/          o player de stories
    stories/              os 11 slides
  ui/                     Button, CountdownTimer, DynamicGradientBg
hooks/useImagePalette.ts  quantizador de cor via canvas
lib/                      datas + utilitários (cn, formatTime, fadeAudio)
scripts/gen-artwork.mjs   gerador das imagens
docs/superpowers/specs/   os design docs da retrospectiva
```
