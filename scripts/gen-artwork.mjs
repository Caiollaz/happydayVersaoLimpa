// Generates every photo used by the site as an illustrated scene.
//
// The site is a public/demo build, so there are no real photographs in it —
// each slot instead gets a hand-composed vector scene that matches what the
// moment is *about* (the movie date, the beach trip, the lazy breakfast).
// Scenes are drawn as SVG and rasterized to JPEG with sharp, so the output
// behaves exactly like a photo: the palette extractor in
// hooks/useImagePalette.ts reads a real dominant color off each one.
//
// Everything is deterministic — same seed, same picture. Re-running never
// reshuffles the gallery.
//
// Run with: node scripts/gen-artwork.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

/* ------------------------------------------------------------------ *
 * Deterministic randomness
 * ------------------------------------------------------------------ */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const between = (r, lo, hi) => lo + r() * (hi - lo);

/* ------------------------------------------------------------------ *
 * Primitives — every scene is assembled from these
 * ------------------------------------------------------------------ */

/** Vertical sky gradient covering the whole frame. */
function sky(W, H, stops, id = "sky") {
  const s = stops
    .map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`)
    .join("");
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${s}</linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}

/** Soft radial bloom — a light source that is not a hard-edged disc. */
function bloom(cx, cy, r, color, opacity = 0.55, id = "bl") {
  return `<defs><radialGradient id="${id}">
      <stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
}

/** The sun/moon disc itself. */
function disc(cx, cy, r, color, opacity = 1) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
}

function stars(r, W, H, count, maxY, color = "#FFFFFF") {
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = r() * W;
    const y = r() * maxY;
    const rad = between(r, 1, 3.2);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${color}" opacity="${between(r, 0.25, 0.9).toFixed(2)}"/>`;
  }
  return out;
}

/** Sea filling from `y` to the bottom, plus a shimmering light column. */
function sea(r, W, H, y, colors, lightX, lightColor) {
  let out = `<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="1" stop-color="${colors[1]}"/>
    </linearGradient></defs>
    <rect x="0" y="${y}" width="${W}" height="${H - y}" fill="url(#sea)"/>`;
  // Reflection column under the light source.
  for (let cy = y + 8; cy < H; cy += between(r, 14, 26)) {
    const t = (cy - y) / (H - y);
    const w = W * between(r, 0.04, 0.13) * (1 + t * 2.2);
    out += `<rect x="${(lightX - w / 2).toFixed(1)}" y="${cy.toFixed(1)}" width="${w.toFixed(1)}" height="${between(r, 3, 7).toFixed(1)}" rx="3" fill="${lightColor}" opacity="${(0.5 * (1 - t * 0.75)).toFixed(2)}"/>`;
  }
  // A few distant wave strokes for texture.
  for (let i = 0; i < 22; i++) {
    const cy = y + r() * (H - y);
    const t = (cy - y) / (H - y);
    const w = between(r, 30, 150) * (0.5 + t);
    out += `<rect x="${(r() * W).toFixed(1)}" y="${cy.toFixed(1)}" width="${w.toFixed(1)}" height="${between(r, 2, 4).toFixed(1)}" rx="2" fill="#FFFFFF" opacity="${(0.10 * (1 - t * 0.5)).toFixed(2)}"/>`;
  }
  return out;
}

/** Layered hills/mountains receding into haze. */
function hills(r, W, H, baseY, layers) {
  let out = "";
  layers.forEach((layer, i) => {
    const y = baseY + i * (H - baseY) * 0.13;
    const amp = layer.amp ?? H * 0.09;
    let d = `M0,${H} L0,${y}`;
    const steps = 6;
    for (let s = 0; s <= steps; s++) {
      const x = (W / steps) * s;
      const peak = y - Math.abs(Math.sin(s * 1.7 + i * 2.1)) * amp - r() * amp * 0.3;
      d += ` L${x.toFixed(1)},${peak.toFixed(1)}`;
    }
    d += ` L${W},${H} Z`;
    out += `<path d="${d}" fill="${layer.color}" opacity="${layer.opacity ?? 1}"/>`;
  });
  return out;
}

/** Procedural city skyline with lit windows. */
function skyline(r, W, H, baseY, color, windowColor) {
  let out = "";
  let x = -20;
  while (x < W + 20) {
    const w = between(r, W * 0.06, W * 0.15);
    const h = between(r, H * 0.10, H * 0.34);
    const y = baseY - h;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(h + 40).toFixed(1)}" fill="${color}"/>`;
    // Windows
    const cols = Math.max(2, Math.floor(w / 22));
    const rows = Math.max(3, Math.floor(h / 30));
    for (let c = 0; c < cols; c++) {
      for (let rw = 0; rw < rows; rw++) {
        if (r() > 0.42) continue;
        const wx = x + 10 + c * ((w - 16) / cols);
        const wy = y + 14 + rw * ((h - 18) / rows);
        out += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="7" height="10" fill="${windowColor}" opacity="${between(r, 0.35, 0.95).toFixed(2)}"/>`;
      }
    }
    x += w + between(r, 4, 16);
  }
  return out;
}

/** A palm tree silhouette anchored at (x, groundY). */
function palm(x, groundY, h, color, lean = 1) {
  const topX = x + lean * h * 0.16;
  const topY = groundY - h;
  let out = `<path d="M${x},${groundY} Q${x + lean * h * 0.06},${groundY - h * 0.55} ${topX},${topY}"
      stroke="${color}" stroke-width="${(h * 0.035).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  const fronds = 7;
  for (let i = 0; i < fronds; i++) {
    const a = (Math.PI / (fronds - 1)) * i + Math.PI;
    const len = h * 0.42;
    const ex = topX + Math.cos(a) * len;
    const ey = topY + Math.sin(a) * len * 0.55 + h * 0.06;
    const mx = topX + Math.cos(a) * len * 0.5;
    const my = topY + Math.sin(a) * len * 0.2 - h * 0.09;
    out += `<path d="M${topX},${topY} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}"
      stroke="${color}" stroke-width="${(h * 0.028).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}

/** Potted plant — a pot plus a handful of individual leaves. */
function plant(x, groundY, s, color) {
  const potTop = groundY - s * 0.55;
  let leaves = `<path d="M${x - s * 0.34},${potTop} L${x + s * 0.34},${potTop} L${x + s * 0.24},${groundY} L${x - s * 0.24},${groundY} Z" fill="${color}"/>`;
  const angles = [-62, -34, -8, 16, 44];
  angles.forEach((deg, i) => {
    const a = (deg * Math.PI) / 180;
    const len = s * (0.75 + (i % 2) * 0.28);
    const ex = x + Math.sin(a) * len;
    const ey = potTop - Math.cos(a) * len;
    const mx = x + Math.sin(a) * len * 0.45;
    const my = potTop - Math.cos(a) * len * 0.55;
    leaves += `<path d="M${x.toFixed(1)},${potTop.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}"
      stroke="${color}" stroke-width="${(s * 0.05).toFixed(1)}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" rx="${(s * 0.17).toFixed(1)}" ry="${(s * 0.09).toFixed(1)}"
      fill="${color}" transform="rotate(${deg} ${ex.toFixed(1)} ${ey.toFixed(1)})"/>`;
  });
  return leaves;
}

/** Rounded conifer / leafy tree silhouette. */
function tree(x, groundY, h, color) {
  const w = h * 0.55;
  return `<path d="M${x},${groundY} L${x},${groundY - h * 0.32}" stroke="${color}" stroke-width="${(h * 0.07).toFixed(1)}" stroke-linecap="round"/>
    <ellipse cx="${x}" cy="${(groundY - h * 0.62).toFixed(1)}" rx="${(w / 2).toFixed(1)}" ry="${(h * 0.38).toFixed(1)}" fill="${color}"/>`;
}

/**
 * Two figures standing together — the recurring "us" motif. Drawn as flat
 * silhouettes so they read at thumbnail size without competing with the
 * scene behind them.
 */
function couple(x, groundY, h, color, opacity = 1) {
  const gap = h * 0.30;
  const fig = (fx, fh, shift) => {
    const headR = fh * 0.105;
    const headY = groundY - fh + headR;
    const shoulderY = headY + headR * 1.9;
    const bodyW = fh * 0.20;
    return `<circle cx="${fx.toFixed(1)}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}" fill="${color}"/>
      <path d="M${(fx - bodyW / 2).toFixed(1)},${groundY}
               L${(fx - bodyW / 2 + shift).toFixed(1)},${shoulderY.toFixed(1)}
               Q${fx.toFixed(1)},${(shoulderY - fh * 0.045).toFixed(1)} ${(fx + bodyW / 2 + shift).toFixed(1)},${shoulderY.toFixed(1)}
               L${(fx + bodyW / 2).toFixed(1)},${groundY} Z" fill="${color}"/>`;
  };
  // Joined arm between the two figures.
  const ax = x - gap / 2 + h * 0.09;
  const bx = x + gap / 2 - h * 0.09;
  const armY = groundY - h * 0.46;
  return `<g opacity="${opacity}">
    ${fig(x - gap / 2, h, 0)}
    ${fig(x + gap / 2, h * 0.93, 0)}
    <path d="M${ax.toFixed(1)},${(armY - h * 0.12).toFixed(1)} Q${x.toFixed(1)},${armY.toFixed(1)} ${bx.toFixed(1)},${(armY - h * 0.1).toFixed(1)}"
      stroke="${color}" stroke-width="${(h * 0.045).toFixed(1)}" fill="none" stroke-linecap="round"/>
  </g>`;
}

/** Bottom-weighted darkening so overlaid text always has something to sit on. */
function vignette(W, H) {
  return `<defs>
      <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000000" stop-opacity="0.30"/>
        <stop offset="0.42" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.45"/>
      </linearGradient>
      <radialGradient id="vr">
        <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.38"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#vg)"/>
    <rect width="${W}" height="${H}" fill="url(#vr)"/>`;
}

/** Fine horizontal texture — keeps large flat gradients from looking like CSS. */
function texture(r, W, H) {
  let out = "";
  for (let i = 0; i < 130; i++) {
    const y = r() * H;
    out += `<rect x="0" y="${y.toFixed(1)}" width="${W}" height="${between(r, 0.6, 1.8).toFixed(1)}" fill="#FFFFFF" opacity="${between(r, 0.008, 0.032).toFixed(3)}"/>`;
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Scenes
 * ------------------------------------------------------------------ */

const SCENES = {
  /** Sun dropping into the sea. The beach-trip signature. */
  praia(r, W, H, p) {
    const horizon = H * 0.56;
    const sunX = W * between(r, 0.35, 0.68);
    const sunY = horizon - H * between(r, 0.02, 0.10);
    return [
      sky(W, H, p.sky),
      bloom(sunX, sunY, W * 0.55, p.glow, 0.6),
      disc(sunX, sunY, W * 0.085, p.sun),
      sea(r, W, H, horizon, p.sea, sunX, p.sun),
      `<rect x="0" y="${H * 0.88}" width="${W}" height="${H * 0.12}" fill="${p.sand}"/>`,
      palm(W * 0.12, H * 0.93, H * 0.5, p.silhouette, -1),
      palm(W * 0.88, H * 0.95, H * 0.42, p.silhouette, 1),
      p.couple ? couple(W * 0.5, H * 0.92, H * 0.24, p.silhouette) : "",
    ].join("");
  },

  /** Layered coastal hills over calm water — the quieter trip frame. */
  enseada(r, W, H, p) {
    const horizon = H * 0.52;
    const sunX = W * 0.3;
    return [
      sky(W, H, p.sky),
      bloom(sunX, horizon - H * 0.16, W * 0.45, p.glow, 0.5),
      disc(sunX, horizon - H * 0.16, W * 0.055, p.sun),
      sea(r, W, H, horizon, p.sea, sunX, p.sun),
      hills(r, W, horizon + 4, horizon - H * 0.16, [
        { color: p.silhouette, opacity: 0.35, amp: H * 0.13 },
        { color: p.silhouette, opacity: 0.6, amp: H * 0.09 },
      ]),
      `<rect x="0" y="${H * 0.9}" width="${W}" height="${H * 0.1}" fill="${p.sand}"/>`,
      palm(W * 0.82, H * 0.94, H * 0.36, p.silhouette, 1),
    ].join("");
  },

  /** Skyline after dark — every night out in the city. */
  cidade(r, W, H, p) {
    const ground = H * 0.82;
    return [
      sky(W, H, p.sky),
      stars(r, W, H, 70, H * 0.5),
      bloom(W * 0.7, H * 0.28, W * 0.4, p.glow, 0.45),
      disc(W * 0.74, H * 0.2, W * 0.05, p.sun, 0.9),
      skyline(r, W, H, ground, p.silhouette, p.windows),
      `<rect x="0" y="${ground}" width="${W}" height="${H - ground}" fill="${p.ground}"/>`,
      p.couple ? couple(W * 0.5, H * 0.97, H * 0.28, p.silhouette) : "",
    ].join("");
  },

  /** Dark room, lit screen, rows of seats. The movie-date frame. */
  cinema(r, W, H, p) {
    const screenX = W * 0.12;
    const screenY = H * 0.14;
    const screenW = W * 0.76;
    const screenH = H * 0.42;
    let seats = "";
    for (let row = 0; row < 3; row++) {
      const y = H * (0.72 + row * 0.11);
      const scale = 1 + row * 0.25;
      for (let i = -1; i < 7; i++) {
        const x = W * 0.06 + i * (W * 0.16) + (row % 2 ? W * 0.07 : 0);
        const w = W * 0.115 * scale;
        const h = H * 0.1 * scale;
        seats += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(h * 2).toFixed(1)}" rx="${(w * 0.22).toFixed(1)}" fill="${p.silhouette}" opacity="${(0.55 + row * 0.18).toFixed(2)}"/>`;
      }
    }
    // What is playing on the screen: a bad movie still lives inside a frame,
    // so the screen gets its own tiny scene rather than a flat fill.
    const filmY = screenY + screenH * 0.62;
    return [
      sky(W, H, p.sky),
      bloom(W * 0.5, screenY + screenH * 0.5, W * 0.85, p.glow, 0.6),
      `<defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${p.sun}" stop-opacity="0.98"/>
          <stop offset="0.55" stop-color="${p.glow}" stop-opacity="0.92"/>
          <stop offset="1" stop-color="${p.windows}" stop-opacity="0.85"/>
        </linearGradient>
        <clipPath id="screenClip">
          <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="${W * 0.012}"/>
        </clipPath>
      </defs>`,
      `<rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="${W * 0.012}" fill="url(#screenGrad)"/>`,
      `<g clip-path="url(#screenClip)">
        <circle cx="${W * 0.5}" cy="${(filmY - screenH * 0.22).toFixed(1)}" r="${(screenW * 0.11).toFixed(1)}" fill="#FFFFFF" opacity="0.75"/>
        <rect x="${screenX}" y="${filmY.toFixed(1)}" width="${screenW}" height="${(screenY + screenH - filmY).toFixed(1)}" fill="${p.silhouette}" opacity="0.55"/>
        <path d="M${screenX},${filmY} L${(W * 0.32).toFixed(1)},${(filmY - screenH * 0.2).toFixed(1)} L${(W * 0.46).toFixed(1)},${filmY.toFixed(1)} Z" fill="${p.silhouette}" opacity="0.7"/>
        <path d="M${(W * 0.44).toFixed(1)},${filmY} L${(W * 0.62).toFixed(1)},${(filmY - screenH * 0.28).toFixed(1)} L${(W * 0.8).toFixed(1)},${filmY.toFixed(1)} Z" fill="${p.silhouette}" opacity="0.8"/>
      </g>`,
      // Light spill from the projector wash onto the room.
      `<path d="M${W * 0.5},${screenY + screenH * 0.5} L${-W * 0.1},${H} L${W * 1.1},${H} Z" fill="${p.glow}" opacity="0.10"/>`,
      // Two heads in the front row, watching.
      `<circle cx="${W * 0.36}" cy="${H * 0.66}" r="${W * 0.055}" fill="${p.silhouette}"/>`,
      `<circle cx="${W * 0.6}" cy="${H * 0.68}" r="${W * 0.05}" fill="${p.silhouette}"/>`,
      seats,
    ].join("");
  },

  /** Table by a window, two cups, steam. The lazy-breakfast frame. */
  cafe(r, W, H, p) {
    const tableY = H * 0.68;
    const cup = (cx, cy, s, tilt) => `
      <g transform="translate(${cx},${cy}) rotate(${tilt})">
        <ellipse cx="0" cy="${(s * 0.62).toFixed(1)}" rx="${(s * 0.95).toFixed(1)}" ry="${(s * 0.2).toFixed(1)}" fill="#000000" opacity="0.22"/>
        <path d="M${-s * 0.62},${-s * 0.42} L${s * 0.62},${-s * 0.42} L${s * 0.47},${s * 0.5} Q0,${s * 0.72} ${-s * 0.47},${s * 0.5} Z" fill="${p.windows}"/>
        <ellipse cx="0" cy="${(-s * 0.42).toFixed(1)}" rx="${(s * 0.62).toFixed(1)}" ry="${(s * 0.17).toFixed(1)}" fill="${p.sun}"/>
        <path d="M${s * 0.6},${-s * 0.22} q${s * 0.42},${s * 0.06} ${s * 0.1},${s * 0.42}" stroke="${p.windows}" stroke-width="${(s * 0.12).toFixed(1)}" fill="none" stroke-linecap="round"/>
      </g>`;
    const steam = (cx, cy, s, o) =>
      `<path d="M${cx},${cy} q${-s * 0.35},${-s * 0.5} 0,${-s} q${s * 0.35},${-s * 0.5} 0,${-s}"
        stroke="#FFFFFF" stroke-width="${(s * 0.11).toFixed(1)}" fill="none" opacity="${o}" stroke-linecap="round"/>`;
    return [
      sky(W, H, p.sky),
      // Window pouring light in.
      `<rect x="${W * 0.08}" y="${H * 0.05}" width="${W * 0.84}" height="${H * 0.5}" rx="${W * 0.03}" fill="${p.glow}" opacity="0.5"/>`,
      `<rect x="${W * 0.495}" y="${H * 0.05}" width="${W * 0.012}" height="${H * 0.5}" fill="${p.silhouette}" opacity="0.5"/>`,
      `<rect x="${W * 0.08}" y="${H * 0.29}" width="${W * 0.84}" height="${W * 0.012}" fill="${p.silhouette}" opacity="0.5"/>`,
      bloom(W * 0.5, H * 0.26, W * 0.6, p.sun, 0.45),
      // Potted plant on the sill — a few leaves, not a solid blob, so the
      // window light still reads through it.
      plant(W * 0.15, tableY, W * 0.19, p.silhouette),
      `<rect x="0" y="${tableY}" width="${W}" height="${H - tableY}" fill="${p.ground}"/>`,
      `<rect x="0" y="${tableY}" width="${W}" height="${H * 0.012}" fill="#FFFFFF" opacity="0.14"/>`,
      cup(W * 0.36, tableY - H * 0.02, W * 0.16, -3),
      cup(W * 0.64, tableY + H * 0.01, W * 0.145, 4),
      steam(W * 0.36, tableY - H * 0.14, W * 0.06, 0.35),
      steam(W * 0.64, tableY - H * 0.11, W * 0.05, 0.28),
    ].join("");
  },

  /** Ferris wheel at dusk — the fair, the first "we should do this again". */
  parque(r, W, H, p) {
    const cx = W * 0.55;
    const cy = H * 0.42;
    const rad = Math.min(W, H) * 0.3;
    // Spokes stay thin so they don't clot into a black disc at the hub, and
    // the cabins hang just outside the rim instead of straddling it.
    let spokes = "";
    let cabins = "";
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
      const ex = cx + Math.cos(a) * rad;
      const ey = cy + Math.sin(a) * rad;
      const gx = cx + Math.cos(a) * rad * 1.1;
      const gy = cy + Math.sin(a) * rad * 1.1;
      spokes += `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${p.silhouette}" stroke-width="${(rad * 0.014).toFixed(1)}" opacity="0.85"/>`;
      cabins += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${gx.toFixed(1)}" y2="${gy.toFixed(1)}" stroke="${p.silhouette}" stroke-width="${(rad * 0.018).toFixed(1)}"/>`;
      cabins += `<rect x="${(gx - rad * 0.075).toFixed(1)}" y="${(gy - rad * 0.055).toFixed(1)}" width="${(rad * 0.15).toFixed(1)}" height="${(rad * 0.12).toFixed(1)}" rx="${(rad * 0.045).toFixed(1)}" fill="${p.sun}" opacity="0.92"/>`;
    }
    return [
      sky(W, H, p.sky),
      stars(r, W, H, 45, H * 0.4),
      bloom(cx, cy, rad * 2.1, p.glow, 0.4),
      // Support frame first, so the wheel reads as sitting in front of it.
      `<path d="M${cx - rad * 0.42},${H * 0.86} L${cx},${cy} L${cx + rad * 0.42},${H * 0.86}" stroke="${p.silhouette}" stroke-width="${(rad * 0.055).toFixed(1)}" fill="none"/>`,
      spokes,
      `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${p.silhouette}" stroke-width="${(rad * 0.035).toFixed(1)}"/>`,
      `<circle cx="${cx}" cy="${cy}" r="${(rad * 0.07).toFixed(1)}" fill="${p.silhouette}"/>`,
      cabins,
      `<rect x="0" y="${H * 0.86}" width="${W}" height="${H * 0.14}" fill="${p.ground}"/>`,
      couple(W * 0.2, H * 0.9, H * 0.2, p.silhouette),
    ].join("");
  },

  /** Empty road heading at the horizon — leaving for the trip. */
  estrada(r, W, H, p) {
    const horizon = H * 0.55;
    let dashes = "";
    let y = horizon + H * 0.03;
    let step = H * 0.03;
    while (y < H) {
      const t = (y - horizon) / (H - horizon);
      const w = W * 0.012 + t * W * 0.05;
      dashes += `<rect x="${(W / 2 - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(step * 0.55).toFixed(1)}" fill="${p.sun}" opacity="0.85"/>`;
      y += step;
      step *= 1.28;
    }
    return [
      sky(W, H, p.sky),
      bloom(W * 0.5, horizon, W * 0.6, p.glow, 0.6),
      disc(W * 0.5, horizon - H * 0.04, W * 0.075, p.sun),
      hills(r, W, H, horizon, [{ color: p.silhouette, opacity: 0.55, amp: H * 0.1 }]),
      `<path d="M${W * 0.44},${horizon} L${W * 0.56},${horizon} L${W * 1.15},${H} L${-W * 0.15},${H} Z" fill="${p.ground}"/>`,
      dashes,
      tree(W * 0.1, H * 0.78, H * 0.26, p.silhouette),
      tree(W * 0.92, H * 0.84, H * 0.32, p.silhouette),
    ].join("");
  },

  /** Rain on glass with the city bokeh behind — the staying-in frame. */
  chuva(r, W, H, p) {
    // Drops on the glass: a bright rim and a darker core read as refraction,
    // and the runs trail *upward* from the drop, the way they do on a window.
    let drops = "";
    for (let i = 0; i < 110; i++) {
      const x = r() * W;
      const y = r() * H;
      const rr = between(r, 4, 15);
      const o = between(r, 0.06, 0.18);
      if (r() > 0.66) {
        const trail = between(r, 25, 110);
        drops += `<rect x="${(x - rr * 0.22).toFixed(1)}" y="${(y - trail).toFixed(1)}" width="${(rr * 0.44).toFixed(1)}" height="${trail.toFixed(1)}" rx="${(rr * 0.22).toFixed(1)}" fill="#FFFFFF" opacity="${(o * 0.45).toFixed(3)}"/>`;
      }
      drops += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#FFFFFF" opacity="${o.toFixed(2)}"/>`;
      drops += `<circle cx="${(x - rr * 0.22).toFixed(1)}" cy="${(y - rr * 0.22).toFixed(1)}" r="${(rr * 0.42).toFixed(1)}" fill="#FFFFFF" opacity="${(o * 1.9).toFixed(2)}"/>`;
    }
    let bokeh = "";
    for (let i = 0; i < 26; i++) {
      const x = r() * W;
      const y = between(r, H * 0.25, H * 0.95);
      const rr = between(r, W * 0.02, W * 0.075);
      bokeh += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${pick(r, [p.sun, p.windows, p.glow])}" opacity="${between(r, 0.12, 0.4).toFixed(2)}"/>`;
    }
    return [sky(W, H, p.sky), bokeh, drops].join("");
  },

  /** Misty layered ridges — the quiet, wide-open frame. */
  serra(r, W, H, p) {
    return [
      sky(W, H, p.sky),
      disc(W * 0.72, H * 0.24, W * 0.06, p.sun, 0.95),
      bloom(W * 0.72, H * 0.24, W * 0.4, p.glow, 0.45),
      hills(r, W, H, H * 0.44, [
        { color: p.silhouette, opacity: 0.22, amp: H * 0.16 },
        { color: p.silhouette, opacity: 0.38, amp: H * 0.13 },
        { color: p.silhouette, opacity: 0.58, amp: H * 0.11 },
        { color: p.silhouette, opacity: 0.82, amp: H * 0.09 },
      ]),
    ].join("");
  },

  /** Night sky over a hill — the long conversations. */
  noite(r, W, H, p) {
    return [
      sky(W, H, p.sky),
      stars(r, W, H, 120, H * 0.78),
      disc(W * 0.76, H * 0.18, W * 0.07, p.sun, 0.95),
      bloom(W * 0.76, H * 0.18, W * 0.32, p.glow, 0.4),
      hills(r, W, H, H * 0.72, [{ color: p.silhouette, opacity: 1, amp: H * 0.08 }]),
      couple(W * 0.42, H * 0.86, H * 0.22, p.silhouette),
    ].join("");
  },

  /**
   * Sun through leaves — the "shot with no occasion". Foliage silhouettes
   * frame the top corners so the frame reads as a photograph looking up,
   * not as a bare gradient.
   */
  luz(r, W, H, p) {
    const sunX = W * between(r, 0.35, 0.68);
    const sunY = H * between(r, 0.28, 0.46);

    // A branch with leaves sweeping in from a top corner.
    const branch = (x0, y0, dir) => {
      let out = `<path d="M${x0},${y0} Q${(x0 + dir * W * 0.28).toFixed(1)},${(y0 + H * 0.1).toFixed(1)} ${(x0 + dir * W * 0.52).toFixed(1)},${(y0 + H * 0.26).toFixed(1)}"
        stroke="${p.silhouette}" stroke-width="${(W * 0.014).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
      for (let i = 1; i <= 7; i++) {
        const t = i / 8;
        const bx = x0 + dir * W * 0.52 * t;
        const by = y0 + H * 0.26 * t * t + H * 0.05 * t;
        const rot = dir * (18 + i * 13);
        const rx = W * between(r, 0.05, 0.085);
        out += `<ellipse cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.42).toFixed(1)}"
          fill="${p.silhouette}" opacity="0.92" transform="rotate(${rot} ${bx.toFixed(1)} ${by.toFixed(1)})"/>`;
      }
      return out;
    };

    // Lens flare discs along the axis from the sun to the frame corner.
    let flare = "";
    for (let i = 1; i <= 4; i++) {
      const fx = sunX + (W * 0.5 - sunX) * i * 0.55;
      const fy = sunY + (H * 0.9 - sunY) * i * 0.32;
      flare += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${(W * between(r, 0.025, 0.07)).toFixed(1)}" fill="${p.sun}" opacity="${between(r, 0.07, 0.16).toFixed(2)}"/>`;
    }

    return [
      sky(W, H, p.sky),
      bloom(sunX, sunY, W * 0.62, p.glow, 0.7),
      disc(sunX, sunY, W * 0.055, p.sun, 0.85),
      flare,
      branch(-W * 0.05, -H * 0.02, 1),
      branch(W * 1.05, H * 0.06, -1),
    ].join("");
  },
};

/* ------------------------------------------------------------------ *
 * Palettes
 * ------------------------------------------------------------------ */

const P = {
  porDoSol: {
    sky: ["#FFD08A", "#FF8C5A", "#E04A6B", "#6B1E4E"],
    sun: "#FFE9A8", glow: "#FFB067", sea: ["#C7477A", "#2E0B33"],
    sand: "#3A1230", silhouette: "#2A0A28", windows: "#FFD08A", ground: "#2A0A28",
  },
  turquesa: {
    sky: ["#BFF4F2", "#5AD5D0", "#1E8FA3", "#0A3446"],
    sun: "#FFF3C4", glow: "#9BE8E2", sea: ["#1FA9B5", "#062430"],
    sand: "#E8D5A8", silhouette: "#07303C", windows: "#FFF3C4", ground: "#07303C",
  },
  noiteRosa: {
    sky: ["#4B1B5E", "#8E2A63", "#D9456F", "#1A0616"],
    sun: "#FFD5E8", glow: "#FF6FA5", sea: ["#8E2A63", "#160512"],
    sand: "#2A0A24", silhouette: "#12040F", windows: "#FFC9DE", ground: "#12040F",
  },
  ambar: {
    sky: ["#FFE2A8", "#FFB25C", "#D9772A", "#3B1A0B"],
    sun: "#FFF6D8", glow: "#FFC978", sea: ["#C46A2C", "#2A1108"],
    sand: "#E5C089", silhouette: "#2A1408", windows: "#FFE2A8", ground: "#2A1408",
  },
  indigo: {
    sky: ["#1B2A6B", "#3B2E8C", "#6B3FA0", "#0A0620"],
    sun: "#E9DCFF", glow: "#8E6BFF", sea: ["#2E2470", "#080518"],
    sand: "#1A1240", silhouette: "#080518", windows: "#C9B6FF", ground: "#080518",
  },
  verde: {
    sky: ["#D6F5C9", "#7ACB78", "#2E8B57", "#0B2318"],
    sun: "#FFF5C0", glow: "#A8E6A0", sea: ["#2E8B57", "#071A11"],
    sand: "#D8CE9A", silhouette: "#0A2016", windows: "#F0FFD8", ground: "#0A2016",
  },
  coral: {
    sky: ["#FFD9CE", "#FF9E7D", "#E5566B", "#3D0F26"],
    sun: "#FFF0DC", glow: "#FFAF8F", sea: ["#D9506A", "#2A0818"],
    sand: "#F0D4B8", silhouette: "#2E0A1C", windows: "#FFE0CE", ground: "#2E0A1C",
  },
  meiaNoite: {
    sky: ["#0E1A3A", "#16305E", "#1E4A7A", "#04070F"],
    sun: "#F2F6FF", glow: "#5B8FD9", sea: ["#123B63", "#03060D"],
    sand: "#0C1A2E", silhouette: "#03060D", windows: "#BFD9FF", ground: "#03060D",
  },
};

/* ------------------------------------------------------------------ *
 * The shot list — what each slot in the site actually shows
 * ------------------------------------------------------------------ */

const SHOTS = [
  // Hero of the "Sobre o casal" card — landscape.
  { out: "photos/about-us.jpeg", w: 1600, h: 1000, scene: "cidade", pal: "noiteRosa", couple: true, seed: 101 },

  // Full-bleed portrait behind the "café da manhã às três da tarde" caption.
  { out: "photos/fav-photo.jpeg", w: 1200, h: 2000, scene: "cafe", pal: "ambar", seed: 202 },

  // Vinyl cover for the retrospective track — tropical, matches the song.
  { out: "covers/nossa-cancao.jpg", w: 1200, h: 1200, scene: "praia", pal: "turquesa", seed: 303 },

  // Player covers — the nine that rotate on the fake "Now Playing" screen.
  { out: "photos/player-covers/FOTO1.jpeg", scene: "praia", pal: "porDoSol", couple: true, seed: 11 },
  { out: "photos/player-covers/FOTO2.jpeg", scene: "cidade", pal: "indigo", couple: true, seed: 12 },
  { out: "photos/player-covers/FOTO3.jpeg", scene: "cafe", pal: "ambar", seed: 13 },
  { out: "photos/player-covers/FOTO4.jpeg", scene: "serra", pal: "turquesa", seed: 14 },
  { out: "photos/player-covers/FOTO5.jpeg", scene: "parque", pal: "noiteRosa", seed: 15 },
  { out: "photos/player-covers/FOTO6.jpeg", scene: "estrada", pal: "coral", seed: 16 },
  { out: "photos/player-covers/FOTO7.jpeg", scene: "noite", pal: "meiaNoite", seed: 17 },
  { out: "photos/player-covers/FOTO8.jpeg", scene: "chuva", pal: "indigo", seed: 18 },
  { out: "photos/player-covers/FOTO9.jpeg", scene: "enseada", pal: "verde", seed: 19 },

  // "Nossos dates" — nights out, the movie, the café, the fair.
  { out: "photos/dates/thumb.jpeg", scene: "cidade", pal: "noiteRosa", couple: true, seed: 21 },
  { out: "photos/dates/photo-1.jpeg", scene: "cinema", pal: "indigo", seed: 22 },
  { out: "photos/dates/photo-2.jpeg", scene: "cafe", pal: "ambar", seed: 23 },
  { out: "photos/dates/photo-3.jpeg", scene: "cidade", pal: "meiaNoite", couple: true, seed: 24 },
  { out: "photos/dates/photo-4.jpeg", scene: "parque", pal: "porDoSol", seed: 25 },
  { out: "photos/dates/photo-5.jpeg", scene: "chuva", pal: "noiteRosa", seed: 26 },
  { out: "photos/dates/photo-6.jpeg", scene: "cinema", pal: "noiteRosa", seed: 27 },
  { out: "photos/dates/photo-7.jpeg", scene: "cafe", pal: "coral", seed: 28 },
  { out: "photos/dates/photo-8.jpeg", scene: "noite", pal: "indigo", seed: 29 },
  { out: "photos/dates/photo-9.jpeg", scene: "cidade", pal: "ambar", couple: true, seed: 30 },
  { out: "photos/dates/photo-10.jpeg", scene: "parque", pal: "meiaNoite", seed: 31 },

  // "Fotos aleatórias" — the loose, no-occasion shots.
  { out: "photos/random/thumb.jpeg", scene: "luz", pal: "coral", seed: 41 },
  { out: "photos/random/photo-1.jpeg", scene: "luz", pal: "porDoSol", seed: 42 },
  { out: "photos/random/photo-2.jpeg", scene: "serra", pal: "verde", seed: 43 },
  { out: "photos/random/photo-3.jpeg", scene: "chuva", pal: "meiaNoite", seed: 44 },
  { out: "photos/random/photo-4.jpeg", scene: "luz", pal: "indigo", seed: 45 },
  { out: "photos/random/photo-5.jpeg", scene: "noite", pal: "noiteRosa", seed: 46 },
  { out: "photos/random/photo-6.jpeg", scene: "cafe", pal: "verde", seed: 47 },
  { out: "photos/random/photo-7.jpeg", scene: "estrada", pal: "ambar", seed: 48 },
  { out: "photos/random/photo-8.jpeg", scene: "luz", pal: "turquesa", seed: 49 },
  { out: "photos/random/photo-9.jpeg", scene: "serra", pal: "porDoSol", seed: 50 },

  // "Primeira viagem" — Ilhabela and Paraty, the coast.
  { out: "photos/first-trip/thumb.jpeg", scene: "praia", pal: "turquesa", couple: true, seed: 61 },
  { out: "photos/first-trip/photo-1.jpeg", scene: "praia", pal: "porDoSol", couple: true, seed: 62 },
  { out: "photos/first-trip/photo-2.jpeg", scene: "enseada", pal: "turquesa", seed: 63 },
  { out: "photos/first-trip/photo-3.jpeg", scene: "estrada", pal: "coral", seed: 64 },
  { out: "photos/first-trip/photo-4.jpeg", scene: "praia", pal: "coral", seed: 65 },
  { out: "photos/first-trip/photo-5.jpeg", scene: "enseada", pal: "verde", seed: 66 },
];

/* ------------------------------------------------------------------ */

async function render(shot) {
  const W = shot.w ?? 1200;
  const H = shot.h ?? 1200;
  const r = rng(shot.seed);
  const palette = { ...P[shot.pal], couple: shot.couple ?? false };
  const body = SCENES[shot.scene](r, W, H, palette);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${body}
${texture(r, W, H)}
${vignette(W, H)}
</svg>`;

  const path = join(PUBLIC, shot.out);
  mkdirSync(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(path);
  return path;
}

const failures = [];
for (const shot of SHOTS) {
  try {
    await render(shot);
    console.log(`✓ ${shot.out}  (${shot.scene} / ${shot.pal})`);
  } catch (err) {
    failures.push(`${shot.out}: ${err.message}`);
    console.log(`✗ ${shot.out} — ${err.message}`);
  }
}

console.log(`\n${SHOTS.length - failures.length}/${SHOTS.length} imagens geradas.`);
if (failures.length) process.exit(1);
