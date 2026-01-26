export const GRADE_COLORS = {
  legendary: "from-amber-500 to-orange-600",
  epic: "from-purple-500 to-violet-600",
  rare: "from-blue-500 to-cyan-600",
};

export const SERVERS = [
  "전체",
  "루페온",
  "실리안",
  "아만",
  "카마인",
  "카제로스",
  "카단",
  "아브렐슈드",
  "니나브",
];

export const CLASS_GROUPS = [
  {
    name: "전사",
    classes: ["버서커", "디스트로이어", "워로드", "홀리나이트", "슬레이어"],
  },
  {
    name: "무도가",
    classes: [
      "스트라이커",
      "배틀마스터",
      "인파이터",
      "기공사",
      "창술사",
      "브레이커",
    ],
  },
  {
    name: "헌터",
    classes: ["데빌헌터", "블래스터", "호크아이", "스카우터", "건슬링어"],
  },
  {
    name: "마법사",
    classes: ["바드", "서머너", "아르카나", "소서리스"],
  },
  {
    name: "암살자",
    classes: ["블레이드", "데모닉", "리퍼", "소울이터"],
  },
  {
    name: "스페셜리스트",
    classes: ["도화가", "기상술사", "환수사"],
  },
  {
    name: "가디언나이트",
    classes: ["가디언나이트"],
  },
];

export const CLASSES = ["전체", ...CLASS_GROUPS.flatMap(g => g.classes)];
