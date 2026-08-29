// Fills the demo's photo slots with real, commercially-licensed photographs
// from Pexels.
//
// Queries deliberately favour frames where nobody is identifiable —
// silhouettes, backs turned, hands, wide shots. Two reasons:
//
//  1. **Licensing.** The Pexels licence covers commercial use, but like
//     every stock licence it does not grant a model release, and it asks
//     that you not imply the people pictured endorse your product.
//     Presenting a recognisable real couple as this product's fictional
//     couple sits uncomfortably close to that line. A silhouette does not.
//  2. **It looks right.** These sites are about *your* couple. A stock
//     face in the demo invites comparison; a silhouette invites projection.
//
// Photographer credits are written to public/photos/CREDITS.md. Pexels does
// not require attribution, but crediting people whose work you are using to
// sell something is the decent minimum.
//
// Run with: node scripts/fetch-photos.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const API = "https://api.pexels.com/v1/search";

/**
 * Reads the key from the environment, falling back to .env.local so it can
 * be set once instead of on every invocation.
 */
function readKey() {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim();

  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(join(__dirname, "..", file), "utf8");
      const match = text.match(/^\s*PEXELS_API_KEY\s*=\s*(.+)$/m);
      if (match) return match[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      // File absent — try the next one.
    }
  }
  return "";
}

const KEY = readKey();

// Fail here rather than 38 identical 401s later. Without a key every single
// request is rejected, so there is nothing useful to attempt.
if (!KEY) {
  console.error(
    [
      "Falta a chave da API do Pexels.",
      "",
      "Pegue uma grátis em https://www.pexels.com/api/ e rode:",
      "",
      "  PEXELS_API_KEY=sua-chave npm run photos",
      "",
      "Ou deixe salva pra não repetir:",
      "",
      "  echo 'PEXELS_API_KEY=sua-chave' >> .env.local",
      "  npm run photos",
      "",
      "Sem isso o site de exemplo continua com o artwork gerado por código,",
      "que funciona — só é menos chamativo que foto de verdade.",
    ].join("\n"),
  );
  process.exit(1);
}

/** Slots to fill, and the kind of shot each one wants. */
const PLAN = [
  { query: "couple silhouette sunset",      out: "photos/player-covers/FOTO1.jpeg" },
  { query: "couple holding hands walking",  out: "photos/player-covers/FOTO2.jpeg" },
  { query: "couple silhouette beach",       out: "photos/player-covers/FOTO3.jpeg" },
  { query: "couple from behind city",       out: "photos/player-covers/FOTO4.jpeg" },
  { query: "couple hands together",         out: "photos/player-covers/FOTO5.jpeg" },
  { query: "couple walking road back",      out: "photos/player-covers/FOTO6.jpeg" },
  { query: "couple silhouette mountain",    out: "photos/player-covers/FOTO7.jpeg" },
  { query: "couple umbrella rain back",     out: "photos/player-covers/FOTO8.jpeg" },
  { query: "couple sunset field",           out: "photos/player-covers/FOTO9.jpeg" },

  { query: "couple silhouette golden hour", out: "photos/about-us.jpeg" },
  { query: "two coffee cups table",         out: "photos/fav-photo.jpeg" },

  { query: "couple holding hands cafe",     out: "photos/dates/thumb.jpeg" },
  { query: "restaurant table candles",      out: "photos/dates/photo-1.jpeg" },
  { query: "cinema seats dark",             out: "photos/dates/photo-2.jpeg" },
  { query: "couple silhouette night city",  out: "photos/dates/photo-3.jpeg" },
  { query: "picnic blanket park",           out: "photos/dates/photo-4.jpeg" },
  { query: "couple hands coffee",           out: "photos/dates/photo-5.jpeg" },
  { query: "night street lights bokeh",     out: "photos/dates/photo-6.jpeg" },
  { query: "ice cream summer hands",        out: "photos/dates/photo-7.jpeg" },
  { query: "bookstore aisle",               out: "photos/dates/photo-8.jpeg" },
  { query: "couple dancing silhouette",     out: "photos/dates/photo-9.jpeg" },
  { query: "sunset balcony two glasses",    out: "photos/dates/photo-10.jpeg" },

  { query: "couple laughing silhouette",    out: "photos/random/thumb.jpeg" },
  { query: "hands intertwined close up",    out: "photos/random/photo-1.jpeg" },
  { query: "dog park walk",                 out: "photos/random/photo-2.jpeg" },
  { query: "kitchen cooking together",      out: "photos/random/photo-3.jpeg" },
  { query: "car road trip window",          out: "photos/random/photo-4.jpeg" },
  { query: "flowers bouquet hands",         out: "photos/random/photo-5.jpeg" },
  { query: "couple shadow wall",            out: "photos/random/photo-6.jpeg" },
  { query: "blanket sofa cozy",             out: "photos/random/photo-7.jpeg" },
  { query: "polaroid photos scattered",     out: "photos/random/photo-8.jpeg" },
  { query: "fireworks night sky",           out: "photos/random/photo-9.jpeg" },

  { query: "couple beach walking back",     out: "photos/first-trip/thumb.jpeg" },
  { query: "beach sunset waves",            out: "photos/first-trip/photo-1.jpeg" },
  { query: "coastal road ocean view",       out: "photos/first-trip/photo-2.jpeg" },
  { query: "hotel window sea",              out: "photos/first-trip/photo-3.jpeg" },
  { query: "boat pier sunset",              out: "photos/first-trip/photo-4.jpeg" },
  { query: "suitcase travel window",        out: "photos/first-trip/photo-5.jpeg" },
];

/** Sizes the site actually uses. Covers are square; the rest are 4:5. */
function dimensionsFor(out) {
  if (out.includes("player-covers")) return { w: 1000, h: 1000 };
  if (out.includes("about-us") || out.includes("fav-photo")) return { w: 1200, h: 1500 };
  return { w: 900, h: 1125 };
}

async function search(query, offset) {
  const url = `${API}?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: KEY } });

  if (res.status === 401) {
    console.error("\n\nA chave do Pexels foi recusada (401). Confira se copiou inteira.");
    process.exit(1);
  }
  if (res.status === 429) {
    console.error("\n\nLimite de requisições do Pexels atingido. Tente de novo mais tarde.");
    process.exit(1);
  }
  if (!res.ok) throw new Error(`Pexels ${res.status} para "${query}"`);

  const json = await res.json();
  const photo = json.photos?.[offset % Math.max(1, json.photos.length)];
  if (!photo) throw new Error(`sem resultado para "${query}"`);
  return photo;
}

const credits = [];
let done = 0;
let failed = 0;

for (const [i, slot] of PLAN.entries()) {
  const target = join(PUBLIC, slot.out);
  mkdirSync(dirname(target), { recursive: true });

  try {
    const photo = await search(slot.query, i);
    const src = photo.src?.large2x ?? photo.src?.large ?? photo.src?.original;
    const bytes = Buffer.from(await (await fetch(src)).arrayBuffer());

    const { w, h } = dimensionsFor(slot.out);
    await sharp(bytes)
      .rotate()
      .resize(w, h, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target);

    credits.push({
      file: slot.out,
      photographer: photo.photographer,
      url: photo.url,
    });
    done++;
    process.stdout.write(".");
  } catch (error) {
    failed++;
    process.stdout.write("x");
    console.error(`\n  ${slot.out}: ${error.message}`);
  }
}

if (credits.length === 0) {
  console.log("\nNada baixado — CREDITS.md não foi alterado.");
  process.exit(1);
}

writeFileSync(
  join(PUBLIC, "photos", "CREDITS.md"),
  [
    "# Créditos das fotos do exemplo",
    "",
    "Todas as fotos abaixo vêm do [Pexels](https://www.pexels.com), sob a",
    "[licença Pexels](https://www.pexels.com/license/) — uso comercial",
    "permitido, atribuição não exigida. Creditamos mesmo assim.",
    "",
    "Elas aparecem **apenas no site de exemplo** (`/demo`). Sites de clientes",
    "usam as fotos que o próprio cliente envia.",
    "",
    "| Arquivo | Fotógrafo | Original |",
    "|---|---|---|",
    ...credits.map((c) => `| \`${c.file}\` | ${c.photographer} | [Pexels](${c.url}) |`),
    "",
  ].join("\n"),
);

console.log(`\n\n${done} baixadas, ${failed} falharam.`);
console.log("Créditos em public/photos/CREDITS.md");
