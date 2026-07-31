import type { Config } from "tailwindcss";

/**
 * Spotify design tokens. Every surface in the app is one of these — keeping
 * them here (instead of raw hexes in components) is what makes the whole
 * experience read as a single, coherent product.
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
      },
      borderRadius: {
        "spotify-btn": "25px",
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
