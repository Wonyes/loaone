export default {
  // ... 기존 설정
  theme: {
    extend: {
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
};
