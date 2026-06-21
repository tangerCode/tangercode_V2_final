import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        brand: {
          primary: {
            "50": "#EBF2FF",
            "100": "#C5DBFF",
            "200": "#9EC5FF",
            "300": "#6BA8FF",
            "400": "#3385FF",
            "500": "#0052CC",
            "600": "#004BB8",
            "700": "#003D99",
            "800": "#002F75",
            "900": "#001F4D",
            DEFAULT: "#0052CC",
          },
          cyan: {
            DEFAULT: "#00D4FF",
          },
          coral: {
            DEFAULT: "#FF6B35",
          },
        },
        maquette: {
          dark: {
            base: "#13141C",
            surface: "#1A1B26",
            elevated: "#22232E",
          },
          light: {
            base: "#E0E5EC",
            surface: "#E0E5EC",
          },
          muted: {
            dark: "#94A3B8",
            light: "#475569",
          },
          border: {
            dark: "rgba(255, 255, 255, 0.08)",
            light: "rgba(0, 0, 0, 0.05)",
          },
        },
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        arabic: ["var(--font-cairo)", "Tajawal", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        morph: "morph 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
      borderRadius: {
        sm: "12px",
        DEFAULT: "18px",
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};

export default config;
