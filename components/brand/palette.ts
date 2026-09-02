export const ink = "#111015";

export const hues = {
  pink: { deep: "#E11D62", mid: "#F0619F", light: "#FFB0E0", pale: "#FFE0F0" },
  blue: { deep: "#2050B0", mid: "#0090FF", light: "#A0E0FF", pale: "#DCF2FF" },
  coral: { deep: "#E85A2A", mid: "#FF8A5C", light: "#FFB090", pale: "#FFDCC8" },
  sun: { deep: "#E0A800", mid: "#FFC400", light: "#FFE040", pale: "#FFF3B0" },
  mint: { deep: "#2DA37F", mid: "#5ED1A6", light: "#B0F0D0", pale: "#DDF9EC" },
} as const;

export const brand = {
  ground: "#EDE9F7",
  paper: "#FFFFFF",
  mist: "#F7F5FC",
  lav: "#E4DDF7",
  "lav-deep": "#D6CCF2",
  ink,
  slate: "#5B5866",
  stroke: "#8A879A",
  danger: "#B9431A",
  ...hues,
} as const;

type Hue = keyof typeof hues;

const HUE_ORDER: Hue[] = ["blue", "coral", "mint", "sun", "pink"];

const PALE_CLASS: Record<Hue, string> = {
  pink: "bg-brand-pink-pale",
  blue: "bg-brand-blue-pale",
  coral: "bg-brand-coral-pale",
  sun: "bg-brand-sun-pale",
  mint: "bg-brand-mint-pale",
};

export function paleClassAt(index: number): string {
  return PALE_CLASS[HUE_ORDER[index % HUE_ORDER.length]];
}

export function alpha(hex: string, opacity: number): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${opacity})`;
}

export function isLight(hex: string): boolean {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6;
}
