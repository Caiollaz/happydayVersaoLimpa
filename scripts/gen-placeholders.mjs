// One-off script to generate SVG placeholders for the mini-card carousels.
// Run with: node scripts/gen-placeholders.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "public", "photos");

const sections = [
  {
    dir: "dates",
    label: "Nossos Dates",
    palette: ["#e84393", "#8e1e5a", "#1a0512"],
  },
  {
    dir: "random",
    label: "Fotos Aleatórias",
    palette: ["#a29bfe", "#5a4ecc", "#0d0a24"],
  },
  {
    dir: "first-trip",
    label: "Primeira Viagem",
    palette: ["#00cec9", "#0f7a75", "#03181a"],
  },
];

function svg(label, subtitle, [c1, c2, c3]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="0.5" stop-color="${c2}"/>
      <stop offset="1" stop-color="${c3}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <text x="300" y="300" font-family="system-ui, sans-serif" font-size="48" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">${label}</text>
  <text x="300" y="350" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#ffffff99" text-anchor="middle" letter-spacing="4">${subtitle}</text>
</svg>
`;
}

for (const section of sections) {
  const dir = join(root, section.dir);
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, "thumb.svg"), svg(section.label, "THUMBNAIL", section.palette));
  for (let i = 1; i <= 3; i++) {
    writeFileSync(
      join(dir, `photo-${i}.svg`),
      svg(section.label, `FOTO ${i} / 3`, section.palette),
    );
  }
  console.log(`✓ ${section.dir}`);
}

console.log("All placeholders generated.");
