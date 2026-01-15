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
    text: "text-[#9e5f04]",
    border: "border-[#9e5f04]/40",
  },
} as const;

export const GRADE_TEXT_COLORS: Record<string, string> = {
  전설: "text-[#ffbb00]",
  영웅: "text-[#ce9eff]",
  희귀: "text-[#66a3ff]",
  고급: "text-[#81f370]",
  일반: "text-[#cccccc]",
};
