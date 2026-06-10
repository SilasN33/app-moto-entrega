import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Operação Limpa"
        paper: {
          DEFAULT: "#FAFAF7",   // background principal
          2: "#F2F0E9",         // surface elevada
          3: "#E9E6DC",         // surface mais profunda
        },
        ink: {
          DEFAULT: "#0A0A0A",   // texto principal
          2: "#3A3934",         // texto secundário forte
          3: "#5C5A53",         // texto secundário
          4: "#86847C",         // texto muted / hint
        },
        line: {
          DEFAULT: "#D9D6CD",   // borda padrão
          strong: "#B8B4A9",    // borda destacada
          subtle: "#E5E2D8",    // borda sutil
        },
        ember: {
          DEFAULT: "#E5481C",   // accent único
          soft: "#F0683F",      // hover
          weak: "#FCE7DE",      // tint de fundo (badges)
          glow: "#FFB58A",      // glow para halo/sombras quentes
        },
        status: {
          pending: "#A66B00",   // âmbar fila
          "pending-bg": "#FAF1D9",
          picked: "#274C77",    // azul-grafite "a caminho"
          "picked-bg": "#E2EAF3",
          delivered: "#2F6B3F", // verde-folha "entregue"
          "delivered-bg": "#E2EFE5",
          cancelled: "#5C5A53",
          "cancelled-bg": "#E9E6DC",
        },
        // Paleta BRASA da landing 3D (ver BRASA_Creative_Bible.md)
        brasa: {
          ember: "#FF6A2B",
          coral: "#FF8A4C",
          charcoal: "#1E1B19",
          golden: "#FFC98A",
          warmwhite: "#F4EDE4",
          sage: "#7FB08A",
        },
      },
      fontFamily: {
        // O pacote geist expõe --font-geist-sans / --font-geist-mono; uma var
        // indefinida invalidaria a declaração inteira e cairia no serif do browser.
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        // Fontes da landing
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightish: "-0.012em",
        tighter2: "-0.022em",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        paper: "0 1px 0 0 rgba(10, 10, 10, 0.04)",
        "paper-lg": "0 1px 0 0 rgba(10, 10, 10, 0.05), 0 8px 24px -16px rgba(10, 10, 10, 0.18)",
        ember: "0 0 0 1px rgba(229, 72, 28, 0.18), 0 8px 24px -10px rgba(229, 72, 28, 0.35)",
      },
      backgroundImage: {
        "paper-grain": "radial-gradient(circle at 1px 1px, rgba(10,10,10,0.04) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "14px 14px",
      },
    },
  },
  plugins: [],
};

export default config;
