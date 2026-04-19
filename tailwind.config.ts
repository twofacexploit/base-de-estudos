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
        tighter: "-0.03em",
        tight: "-0.02em"
      },
      colors: {
        bg: {
          DEFAULT: "#0a0f0a",
          subtle: "#0d120d",
          elevated: "#111911",
          card: "#131a13",
          hover: "#182018",
          inset: "#080c08"
        },
        border: {
          subtle: "#1a2a1a",
          DEFAULT: "#1f2f1f",
          strong: "#2a3f2a"
        },
        fg: {
          DEFAULT: "#e8f0e8",
          muted: "#8fa88f",
          subtle: "#5a7a5a",
          faint: "#3d5a3d"
        },
        accent: {
          DEFAULT: "#4ade80",
          hover: "#22c55e",
          muted: "#166534",
          glow: "#4ade8040"
        },
        block: {
          ciber: "#f87171",
          ia: "#a78bfa",
          marketing: "#4ade80",
          infra: "#fb923c",
          prog: "#60a5fa",
          design: "#f472b6",
          video: "#34d399"
        }
      },
      boxShadow: {
        "card": "0 0 0 1px rgba(74,222,128,0.06), 0 1px 3px 0 rgba(0,0,0,0.4), 0 4px 16px 0 rgba(0,0,0,0.3)",
        "card-hover": "0 0 0 1px rgba(74,222,128,0.15), 0 4px 24px 0 rgba(0,0,0,0.5), 0 0 40px -10px rgba(74,222,128,0.12)",
        "glow-green": "0 0 24px rgba(74,222,128,0.25), 0 0 48px rgba(74,222,128,0.1)",
        "glow-green-sm": "0 0 12px rgba(74,222,128,0.2)",
        "inset-top": "inset 0 1px 0 0 rgba(74,222,128,0.08)"
      },
      animation: {
        "fade-up": "fade-up 500ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 400ms cubic-bezier(0.16,1,0.3,1) both",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
