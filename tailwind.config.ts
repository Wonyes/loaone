import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        desktop: "1400px",
      },
      animation: {
        slide: "slide 2s ease-in-out infinite",
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
