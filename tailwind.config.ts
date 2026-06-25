import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand = courier red (DHL-inspired #D40511).
        brand: {
          50: "#fff1f1",
          100: "#ffdfe0",
          200: "#ffc5c7",
          300: "#ff9da1",
          400: "#ff646b",
          500: "#f5333c",
          600: "#d40511",
          700: "#b10310",
          800: "#920813",
          900: "#790c14",
          950: "#420307",
        },
        // Accent = signature yellow (#FFCC00).
        accent: {
          50: "#fffbe6",
          100: "#fff6c2",
          200: "#ffec85",
          300: "#ffdf47",
          400: "#ffd21a",
          500: "#ffcc00",
          600: "#e6b800",
          700: "#bf9500",
          800: "#9c7600",
          900: "#806100",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(16,24,40,0.08), 0 6px 24px -4px rgba(16,24,40,0.08)",
        lift: "0 18px 40px -12px rgba(16,24,40,0.22)",
        card: "0 1px 2px rgba(16,24,40,0.06), 0 8px 24px -8px rgba(16,24,40,0.12)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
