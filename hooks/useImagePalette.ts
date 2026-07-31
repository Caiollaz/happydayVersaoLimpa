"use client";

import { useEffect, useState } from "react";

export interface Palette {
  dominant: string;
  vibrant: string;
  darkVibrant: string;
  lightVibrant: string;
  muted: string;
  darkMuted: string;
}

const FALLBACK_PALETTE: Palette = {
  dominant: "#1DB954",
  vibrant: "#1DB954",
  darkVibrant: "#0d6b31",
  lightVibrant: "#63e287",
  muted: "#6a6a6a",
  darkMuted: "#2a2a2a",
};

const cache = new Map<string, Palette>();

/**
 * Extracts a Spotify-style color palette from an image URL using a tiny
 * Canvas-based quantizer. Downsamples the image to 64×64, buckets pixels by
 * hue/saturation/lightness, and returns the dominant saturated color plus
 * lightened/darkened variants.
 */
export function useImagePalette(imageUrl: string | null | undefined): Palette {
  const [palette, setPalette] = useState<Palette>(() => {
    if (imageUrl && cache.has(imageUrl)) return cache.get(imageUrl)!;
    return FALLBACK_PALETTE;
  });

  useEffect(() => {
    if (!imageUrl) {
      setPalette(FALLBACK_PALETTE);
      return;
    }
    if (cache.has(imageUrl)) {
      setPalette(cache.get(imageUrl)!);
      return;
    }

    let cancelled = false;

    extractPalette(imageUrl)
      .then((result) => {
        if (cancelled) return;
        cache.set(imageUrl, result);
        setPalette(result);
      })
      .catch((err) => {
        console.warn("[useImagePalette] extraction failed:", err);
        if (!cancelled) setPalette(FALLBACK_PALETTE);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return palette;
}

async function extractPalette(url: string): Promise<Palette> {
  const img = await loadImage(url);

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas 2d context unavailable");

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  // Bucket pixels by coarse HSL to find the dominant hue cluster. We weight
  // saturated pixels more heavily so a vivid accent beats a wash of gray.
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;

    const { h, s, l } = rgbToHsl(r, g, b);
    // Skip near-black / near-white pixels — they muddy the dominant color.
    if (l < 0.08 || l > 0.95) continue;

    const hueBucket = Math.round(h * 12) % 12; // 30° hue bins
    const satBucket = s > 0.35 ? "sat" : "dull";
    const key = `${hueBucket}:${satBucket}`;

    const weight = s > 0.35 ? 3 : 1;
    const existing = buckets.get(key);
    if (existing) {
      existing.count += weight;
      existing.r += r * weight;
      existing.g += g * weight;
      existing.b += b * weight;
    } else {
      buckets.set(key, { count: weight, r: r * weight, g: g * weight, b: b * weight });
    }
  }

  if (buckets.size === 0) return FALLBACK_PALETTE;

  // Pick the largest bucket; prefer saturated ones on ties.
  let best: { count: number; r: number; g: number; b: number; key: string } | null = null;
  for (const [key, val] of buckets) {
    const isSat = key.endsWith(":sat");
    const bias = isSat ? 1.15 : 1; // nudge saturated buckets ahead
    const score = val.count * bias;
    if (!best || score > best.count) {
      best = { ...val, count: score, key };
    }
  }
  if (!best) return FALLBACK_PALETTE;

  const avgR = Math.round(best.r / (best.count / (best.key.endsWith(":sat") ? 1.15 : 1)));
  const avgG = Math.round(best.g / (best.count / (best.key.endsWith(":sat") ? 1.15 : 1)));
  const avgB = Math.round(best.b / (best.count / (best.key.endsWith(":sat") ? 1.15 : 1)));

  const dominant = { r: clamp255(avgR), g: clamp255(avgG), b: clamp255(avgB) };
  const { h, s } = rgbToHsl(dominant.r, dominant.g, dominant.b);

  // Build a Spotify-style palette from the dominant hue.
  const vibrant = hslToRgb(h, Math.max(s, 0.55), 0.5);
  const darkVibrant = hslToRgb(h, Math.max(s, 0.55), 0.22);
  const lightVibrant = hslToRgb(h, Math.min(s, 0.7), 0.75);
  const muted = hslToRgb(h, 0.22, 0.48);
  const darkMuted = hslToRgb(h, 0.18, 0.2);

  return {
    dominant: rgbToHex(dominant.r, dominant.g, dominant.b),
    vibrant: rgbToHex(vibrant.r, vibrant.g, vibrant.b),
    darkVibrant: rgbToHex(darkVibrant.r, darkVibrant.g, darkVibrant.b),
    lightVibrant: rgbToHex(lightVibrant.r, lightVibrant.g, lightVibrant.b),
    muted: rgbToHex(muted.r, muted.g, muted.b),
    darkMuted: rgbToHex(darkMuted.r, darkMuted.g, darkMuted.b),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load image: ${src}`));
    img.src = src;
  });
}

function clamp255(v: number) {
  return Math.max(0, Math.min(255, v));
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp255(Math.round(n)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}
