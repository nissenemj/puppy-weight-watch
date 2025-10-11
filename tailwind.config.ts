import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"], // Enable dark mode with class strategy
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        // Single font family - Inter for everything
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.12)",
      },
      colors: {
        brand: {
          orange: "#E85A28",
          yellow: "#FFD23F",
          green: "#4CAF50",
          ink: "#0F172A",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Simplified color system
        terracotta: {
          "100": "var(--color-primary-100)",
          "500": "var(--color-primary-500)",
          "700": "var(--color-primary-700)",
        },
      },
      backgroundImage: {
        // Single hero gradient
        "gradient-primary":
          "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-500))",
      },
      borderRadius: {
        xl2: "1.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Mobile optimization utilities
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".text-wrap": {
          "word-wrap": "break-word",
          "word-break": "break-word",
          hyphens: "auto",
          "overflow-wrap": "break-word",
        },
        ".mobile-container": {
          width: "100%",
          "max-width": "100vw",
          "padding-left": "1rem",
          "padding-right": "1rem",
          "margin-left": "auto",
          "margin-right": "auto",
          "box-sizing": "border-box",
        },
        ".prevent-overflow": {
          "overflow-x": "hidden",
          "max-width": "100%",
        },
        ".touch-target": {
          "min-height": "44px",
          "min-width": "44px",
          "touch-action": "manipulation",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".safe-area": {
          "padding-top": "env(safe-area-inset-top)",
          "padding-bottom": "env(safe-area-inset-bottom)",
          "padding-left": "env(safe-area-inset-left)",
          "padding-right": "env(safe-area-inset-right)",
        },
        ".mobile-full": {
          width: "100vw",
          "margin-left": "calc(-50vw + 50%)",
          "margin-right": "calc(-50vw + 50%)",
          "padding-left": "1rem",
          "padding-right": "1rem",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
