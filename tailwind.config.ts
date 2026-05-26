import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {

      fontFamily: {
        sans: ["Lato", "sans-serif"],
        carmax: ["Carmax Variable", "sans-serif"],
      },

      colors: {
        border: {
          DEFAULT: "hsl(214.3 31.8% 91.4%)",
          dark: "hsl(217.2 32.6% 17.5%)",
        },
        input: {
          DEFAULT: "hsl(214.3 31.8% 91.4%)",
          dark: "hsl(217.2 32.6% 17.5%)",
        },
        ring: {
          DEFAULT: "hsl(222.2 84% 4.9%)",
          dark: "hsl(212.7 26.8% 83.9%)",
        },
        background: {
          DEFAULT: "hsl(0 0% 100%)",
          dark: "hsl(222.2 84% 4.9%)",
        },
        foreground: {
          DEFAULT: "hsl(0 0% 0%)",
          dark: "hsl(210 40% 98%)",
        },
        primary: {
          DEFAULT: "hsl(152 67% 42%)",
          foreground: "hsl(0 0% 100%)",
          dark: "hsl(210 40% 98%)",
          "dark-foreground": "hsl(222.2 47.4% 11.2%)",
        },
        secondary: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
          dark: "hsl(217.2 32.6% 17.5%)",
          "dark-foreground": "hsl(210 40% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
          dark: "hsl(0 62.8% 30.6%)",
          "dark-foreground": "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
          dark: "hsl(217.2 32.6% 17.5%)",
          "dark-foreground": "hsl(215 20.2% 65.1%)",
        },
        accent: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
          dark: "hsl(217.2 32.6% 17.5%)",
          "dark-foreground": "hsl(210 40% 98%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
          dark: "hsl(222.2 84% 4.9%)",
          "dark-foreground": "hsl(210 40% 98%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
          dark: "hsl(222.2 84% 4.9%)",
          "dark-foreground": "hsl(210 40% 98%)",
        },
        "hero-bg": "rgb(196 234 250)",
        "brand-green": {
          DEFAULT: "#01a960",
          foreground: "hsl(0 0% 100%)",
        },
        "search-panel": "hsl(165 35% 75%)",
        "result-bg": "hsl(200 75% 92%)",
        "review-bg": "hsl(220 60% 96%)",
        "diff-card": "hsl(210 100% 97%)",
        "price-green": "hsl(145 75% 40%)",
        "review-avatar": "hsl(270 60% 50%)",
        "review-name": "hsl(220 70% 25%)",
        star: "hsl(45 100% 51%)",
        "dark-section": {
          DEFAULT: "hsl(0 0% 7%)",
          foreground: "hsl(0 0% 100%)",
        },
        "dark-card": "hsl(0 0% 10%)",
        "dark-border": "hsl(0 0% 18%)",
        sidebar: {
          DEFAULT: "hsl(0 0% 98%)",
          foreground: "hsl(240 5.3% 26.1%)",
          primary: "hsl(240 5.9% 10%)",
          "primary-foreground": "hsl(0 0% 98%)",
          accent: "hsl(240 4.8% 95.9%)",
          "accent-foreground": "hsl(240 5.9% 10%)",
          border: "hsl(220 13% 91%)",
          ring: "hsl(217.2 91.2% 59.8%)",
          dark: "hsl(240 5.9% 10%)",
          "dark-foreground": "hsl(240 4.8% 95.9%)",
          "dark-primary": "hsl(224.3 76.3% 48%)",
          "dark-primary-foreground": "hsl(0 0% 100%)",
          "dark-accent": "hsl(240 3.7% 15.9%)",
          "dark-accent-foreground": "hsl(240 4.8% 95.9%)",
          "dark-border": "hsl(240 3.7% 15.9%)",
          "dark-ring": "hsl(217.2 91.2% 59.8%)",
        },
      },

      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;