import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#050510",
          secondary: "#0a0a1a",
          card: "#0f0f23",
        },
        // Jarvis HUD colors
        hud: {
          blue: "#00d4ff",
          cyan: "#00fff2",
          purple: "#a855f7",
          pink: "#f0abfc",
          glow: "rgba(0, 212, 255, 0.3)",
        },
        accent: {
          DEFAULT: "#00d4ff",
          light: "#00fff2",
          dark: "#0066cc",
        },
        foreground: {
          DEFAULT: "#ffffff",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
        border: {
          DEFAULT: "rgba(0, 212, 255, 0.2)",
          bright: "rgba(0, 255, 242, 0.4)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "scan": "scan 2s linear infinite",
        "scan-line": "scanLine 3s linear infinite",
        "glitch": "glitch 1s linear infinite",
        "data-stream": "dataStream 20s linear infinite",
        "rotate-slow": "rotateSlow 20s linear infinite",
        "flicker": "flicker 0.15s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        scanLine: {
          "0%": { top: "-10%" },
          "100%": { top: "110%" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        dataStream: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        "hud": "0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.1)",
        "hud-lg": "0 0 40px rgba(0, 212, 255, 0.4), inset 0 0 30px rgba(0, 212, 255, 0.1)",
        "neon": "0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 20px #00d4ff",
        "neon-purple": "0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 20px #a855f7",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)",
        "circuit": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300d4ff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
