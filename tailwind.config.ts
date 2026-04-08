import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        "text-muted": "var(--color-text-muted)",
        "text-dim": "var(--color-text-dim)",
        "border-light": "var(--color-border-light)",
        teal: "var(--color-teal)",
        "teal-glow": "var(--color-teal-glow)",
      },
    },
  },
  plugins: [],
};

export default config;
