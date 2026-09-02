import type { Config } from "tailwindcss";

import { alpha, brand } from "./components/brand/palette";

/**
 * Two palettes, deliberately apart. `spotify` is the published gift — every
 * surface of the dark experience is one of these. `brand` is everything
 * around it: the sales page, the wizard, checkout, admin and the legal pages,
 * all light. Both live here instead of as raw hexes in components, which is
 * what makes each world read as a single, coherent product.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: "#121212",
          card: "#181818",
          "card-hover": "#282828",
          elevated: "#242424",
          green: "#1DB954",
          "green-hover": "#1ED760",
          "green-press": "#169C46",
          text: {
            primary: "#FFFFFF",
            secondary: "#B3B3B3",
          },
        },
        brand,
      },
      borderRadius: {
        "spotify-btn": "25px",
        panel: "36px",
        card: "24px",
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["2rem", { lineHeight: "1.12", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-lg": [
          "2.75rem",
          { lineHeight: "1.12", letterSpacing: "-0.035em", fontWeight: "800" },
        ],
        body: ["15px", { lineHeight: "1.6" }],
        caption: ["13px", { lineHeight: "1.5" }],
      },
      boxShadow: {
        pop: `0 24px 60px -24px ${alpha(brand.ink, 0.35)}`,
        sheet: `0 -20px 60px -30px ${alpha(brand.ink, 0.45)}`,
        menu: `0 24px 40px -24px ${alpha(brand.ink, 0.25)}`,
        phone: `0 30px 60px -30px ${alpha(brand.ink, 0.45)}`,
        pin: `0 6px 20px -10px ${alpha(brand.ink, 0.35)}`,
      },
      backgroundImage: {
        halo: `radial-gradient(120% 90% at 50% -8%, ${alpha(brand["lav-deep"], 0.9)} 0%, ${alpha(brand.ground, 0.5)} 40%, ${alpha(brand.paper, 0)} 72%)`,
      },
      keyframes: {
        "brand-rise": {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "none" },
        },
        "brand-drift": {
          "0%, 100%": { transform: "translateY(0) rotate(var(--tilt, 0deg))" },
          "50%": { transform: "translateY(-16px) rotate(var(--tilt, 0deg))" },
        },
        "brand-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "brand-sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "none" },
        },
        "brand-pop": {
          from: { opacity: "0", transform: "translateY(-4px) scale(0.98)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "brand-rise": "brand-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "brand-drift": "brand-drift 8s ease-in-out infinite",
        "brand-fade": "brand-fade 0.2s ease-out",
        "brand-sheet-up": "brand-sheet-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "brand-pop": "brand-pop 0.18s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
