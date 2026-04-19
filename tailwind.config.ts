import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace"
        ]
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em"
      },
      colors: {
        bg: {
          DEFAULT: "#0b0d10",
          subtle: "#0f1115",
          elevated: "#14171c",
          card: "#14171c",
          hover: "#1a1e25",
          inset: "#090b0e"
        },
        border: {
          subtle: "#1a1e25",
          DEFAULT: "#242933",
          strong: "#323845"
        },
        fg: {
          DEFAULT: "#e6e8ec",
          muted: "#9aa3b2",
          subtle: "#6b7280",
          faint: "#4b5563"
        },
        accent: {
          DEFAULT: "#8b9cf8",
          hover: "#a4b2fa"
        },
        block: {
          ciber: "#e06c75",
          ia: "#a78bfa",
          marketing: "#5ccb9b",
          infra: "#e8a15e",
          prog: "#6aa9ff",
          design: "#f08fb8",
          video: "#5ec6d1"
        }
      },
      boxShadow: {
        "card-subtle":
          "0 0 0 1px rgba(255,255,255,0.04), 0 1px 2px 0 rgba(0,0,0,0.3)",
        "card-hover":
          "0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px -10px rgba(0,0,0,0.5)",
        "inset-bottom": "inset 0 -1px 0 0 rgba(255,255,255,0.04)"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none"
          }
        }
      },
      animation: {
        "fade-up": "fade-up 400ms ease-out both",
        "fade-in": "fade-in 300ms ease-out both"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
