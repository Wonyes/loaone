import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      nav: "1130px",
      xl: "1280px",
      desktop: "1400px",
      "2xl": "1536px",
    },
    extend: {
      animation: {
        slide: "slide 2s ease-in-out infinite",
        "spin-slow": "spin 4s linear infinite",
      },
      keyframes: {
        slide: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(400%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
