export const GRADE_STYLES = {
  에스더: {
    bg: "bg-gradient-to-br from-[#0c2e2c] to-[#2faba8]",
    text: "text-[#1ab9b6]",
    border: "border-[#1ab9b6]/40",
  },
  고대: {
    bg: "bg-gradient-to-br from-[#3d3325] to-[#dcc999]",
    text: "text-[#dcc999]",
    border: "border-[#dcc999]/40",
  },
  유물: {
    bg: "bg-gradient-to-br from-[#341a09] to-[#a24006]",
    text: "text-[#a24006]",
    border: "border-[#a24006]/40",
  },
  영웅: {
    bg: "bg-gradient-to-br from-[#2d1b4e] to-[#8b5cf6]",
    text: "text-[#a78bfa]",
    border: "border-[#a78bfa]/40",
  },
  전설: {
    bg: "bg-gradient-to-br from-[#362003] to-[#9e5f04]",
    text: "text-[#ffbb00]",
    border: "border-[#ffbb00]/40",
  },
  희귀: {
    bg: "bg-gradient-to-br from-[#0a1e3d] to-[#1e4a8a]",
    text: "text-[#66a3ff]",
    border: "border-[#66a3ff]/40",
  },
  고급: {
    bg: "bg-gradient-to-br from-[#1a2e1a] to-[#2d5016]",
    text: "text-[#81f370]",
    border: "border-[#81f370]/40",
  },
  일반: {
    bg: "bg-gradient-to-br from-[#1a1a1a] to-[#333333]",
    text: "text-[#cccccc]",
    border: "border-[#cccccc]/40",
  },
} as const;

export type GradeType = keyof typeof GRADE_STYLES;
