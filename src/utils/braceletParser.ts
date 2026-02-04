export interface BraceletStat {
  name: string;
  value: string;
  color: string;
}

export interface BraceletEffect {
  type: string;
  fullDescription: string;
  shortName: string;
  color: string;
  tier: "하" | "중" | "상";
  tierColor: string;
}

// 티어 범위 정의
const tierRanges: Record<string, { low: number; mid: number; high: number }> = {
  // 딜러 이중옵
  진멸: { low: 2.5, mid: 3, high: 3.5 },
  습격: { low: 6.8, mid: 8.4, high: 10 },
  우월: { low: 2, mid: 2.5, high: 3 },
  "우월-": { low: 4.5, mid: 5, high: 5.5 },
  무포: { low: 6900, mid: 7800, high: 8700 },
  정밀: { low: 3.4, mid: 4.2, high: 5 },
  "무공-중첩": { low: 1160, mid: 1320, high: 1480 },
  "무공-생명": { low: 7200, mid: 8100, high: 9000 },
  방향성: { low: 2.5, mid: 3, high: 3.5 },
  기습: { low: 2.5, mid: 3, high: 3.5 },
  결대: { low: 2.5, mid: 3, high: 3.5 },
  타대: { low: 2.5, mid: 3, high: 3.5 },
  적주피: { low: 2, mid: 2.5, high: 3 },

  // 딜러 단일 옵
  무공: { low: 7200, mid: 8100, high: 9000 },
  치피: { low: 6.8, mid: 8.4, high: 10 },
  치적: { low: 3.4, mid: 4.2, high: 5 },
  추피: { low: 3, mid: 3.5, high: 4 },

  // 서폿 시너지
  비수: { low: 1.8, mid: 2.1, high: 2.5 },
  약노: { low: 1.8, mid: 2.1, high: 2.5 },
  회심: { low: 3.6, mid: 4.2, high: 4.8 },
  응원: { low: 0.9, mid: 1.1, high: 1.5 },
  파회: { low: 3.6, mid: 4.2, high: 4.8 },

  // 서폿 단일옵
  보회: { low: 2.5, mid: 3, high: 3.5 },
  아공강: { low: 4, mid: 5, high: 6 },
  아피강: { low: 6, mid: 7.5, high: 9 },

  // 고정옵
  공이속: { low: 4, mid: 5, high: 6 },
  자원회복: { low: 8, mid: 10, high: 12 },
  슈퍼아머: { low: 80, mid: 70, high: 60 },
  도망가: { low: 8, mid: 10, high: 12 },
  최생: { low: 11200, mid: 12600, high: 14000 },
};

// 효과별 티어 판단 함수
function getEffectTier(
  value: number,
  shortName: string
): { tier: "하" | "중" | "상"; tierColor: string } {
  const range = tierRanges[shortName];
  if (!range) {
    return { tier: "중", tierColor: "text-blue-400" };
  }

  if (shortName === "슈퍼아머") {
    if (value <= range.high) return { tier: "상", tierColor: "text-amber-400" };
    if (value <= range.mid) return { tier: "중", tierColor: "text-blue-400" };
    return { tier: "하", tierColor: "text-green-400" };
  }

  if (value >= range.high) return { tier: "상", tierColor: "text-amber-400" };
  if (value >= range.mid) return { tier: "중", tierColor: "text-blue-400" };
  return { tier: "하", tierColor: "text-green-400" };
}

const effectPatterns: {
  regex: RegExp;
  shortName: string;
  color: string;
  valueRegex: RegExp;
}[] = [
  // ========== 딜러 이중옵 ==========
  {
    regex:
      /무기\s*공격력이\s*[\d,.]+\s*,\s*공격\s*및\s*이동\s*속도가\s*1%\s*증가한다/,
    shortName: "무공(중첩)",
    color: "text-yellow-400",
    valueRegex: /무기\s*공격력이\s*([\d,.]+)/,
  },
  {
    regex:
      /자신의\s*생명력이\s*50%\s*이상일\s*경우\s*적에게\s*공격\s*적중\s*시/,
    shortName: "무공(생명)",
    color: "text-yellow-400",
    valueRegex: /무기\s*공격력이\s*([\d,.]+)\s*증가한다/,
  },
  {
    regex: /방향성\s*공격\s*피해량이\s*[\d,.]+%\s*증가한다/,
    shortName: "방향성",
    color: "text-purple-400",
    valueRegex: /피해량이\s*([\d,.]+)%/,
  },
  {
    regex: /백어택\s*공격\s*시\s*적에게\s*주는\s*피해가\s*[\d,.]+%\s*증가한다/,
    shortName: "백어택",
    color: "text-purple-400",
    valueRegex: /피해가\s*([\d,.]+)%/,
  },
  {
    regex:
      /헤드어택\s*공격\s*시\s*적에게\s*주는\s*피해가\s*[\d,.]+%\s*증가한다/,
    shortName: "헤드어택",
    color: "text-purple-400",
    valueRegex: /피해가\s*([\d,.]+)%/,
  },
  {
    regex:
      /(?<!하지만\s*[,，]?\s*|적중\s*시\s*|스킬이\s*|상태의\s*)적에게\s*주는\s*피해가\s*[\d,.]+\s*%\s*증가한다/,
    shortName: "적주피",
    color: "text-red-400",
    valueRegex: /적에게\s*주는\s*피해가\s*([\d,.]+)\s*%/,
  },
  {
    regex: /추가\s*피해가\s*[\d.]+%\s*증가한다\.\s*악마 및 대악마/,
    shortName: "진멸",
    color: "text-purple-400",
    valueRegex: /추가\s*피해가\s*([\d.]+)%/,
  },
  {
    regex:
      /치명타\s*피해가\s*[\d.]+%\s*증가한다\.\s*공격이 치명타로 적중 시 적에게 주는 피해가/,
    shortName: "습격",
    color: "text-red-400",
    valueRegex: /치명타\s*피해가\s*([\d.]+)%/,
  },
  {
    regex:
      /스킬의\s*재사용\s*대기\s*시간이\s*[\d,.]+\s*%\s*증가하지만\s*,\s*적에게\s*주는\s*피해가\s*[\d,.]+\s*%\s*증가한다/,
    shortName: "우월-",
    color: "text-red-400",
    valueRegex:
      /스킬의\s*재사용\s*대기\s*시간이\s*[\d,.]+\s*%\s*증가하지만\s*,\s*적에게\s*주는\s*피해가\s*([\d,.]+)\s*%/,
  },
  {
    regex:
      /적에게 주는 피해가 \s*[\d.]+%\s*증가하며, *무력화 상태의 적에게 주는 피해가\s*[\d.]+%\s*증가한다./,
    shortName: "우월",
    color: "text-red-400",
    valueRegex:
      /적에게 주는 피해가 \s*([\d.]+)% 증가하며, *무력화 상태의 적에게 주는 피해가\s*[\d.]+%\s*증가한다./,
  },

  {
    regex:
      /치명타 적중률이 \s*[\d.]+%\s* 증가한다.\공격이 치명타로 적중 시 적에게 주는 피해가\s*[\d.]+%\s*증가한다\./,
    shortName: "정밀",
    color: "text-red-400",
    valueRegex: /치명타 적중률이 \s*([\d.]+)% 증가한다./,
  },
  {
    regex: /무기 공격력이\s*[\d,]+\s*증가한다\.\s*공격 적중 시\s*30초/,
    shortName: "무포",
    color: "text-yellow-400",
    valueRegex: /무기 공격력이\s*([\d,]+)\s*증가한다/,
  },

  // ========== 딜러 단일 옵 ==========
  {
    regex: /무기\s*공격력\s*\+([\d,.]+)/,
    shortName: "무공",
    color: "text-yellow-400",
    valueRegex: /무기\s*공격력\s*\+([\d,.]+)/,
  },
  {
    regex: /치명타\s*피해\s*\+([\d,.]+)/,
    shortName: "치피",
    color: "text-yellow-400",
    valueRegex: /치명타\s*피해\s*\+([\d,.]+)/,
  },
  {
    regex: /치명타\s*적중률\s*\+([\d,.]+)/,
    shortName: "치적",
    color: "text-yellow-400",
    valueRegex: /치명타\s*적중률\s*\+([\d,.]+)/,
  },
  {
    regex: /추가\s*피해\s*\+([\d,.]+)/,
    shortName: "추피",
    color: "text-yellow-400",
    valueRegex: /추가\s*피해\s*\+([\d,.]+)/,
  },
  {
    regex: /백어택\s*스킬이\s*적에게\s*주는\s*피해가\s*[\d,.]+\s*%\s*증가한다/,
    shortName: "기습",
    color: "text-red-400",
    valueRegex: /백어택\s*스킬이\s*적에게\s*주는\s*피해가\s*([\d,.]+)\s*%/,
  },
  {
    regex:
      /헤드어택\s*스킬이\s*적에게\s*주는\s*피해가\s*[\d,.]+\s*%\s*증가한다/,
    shortName: "결대",
    color: "text-red-400",
    valueRegex: /헤드어택\s*스킬이\s*적에게\s*주는\s*피해가\s*([\d,.]+)\s*%/,
  },
  {
    regex:
      /방향성\s*공격이\s*아닌\s*스킬이\s*적에게\s*주는\s*피해가\s*[\d,.]+\s*%\s*증가한다/,
    shortName: "타대",
    color: "text-red-400",
    valueRegex:
      /방향성\s*공격이\s*아닌\s*스킬이\s*적에게\s*주는\s*피해가\s*([\d,.]+)\s*%/,
  },

  // ========== 서폿 이중옵 ==========
  {
    regex:
      /몬스터에게 공격 적중 시.*8초 동안 대상의 방어력을\s*[\d.]+%\s*감소시킨다./,
    shortName: "비수",
    color: "text-pink-400",
    valueRegex: /몬스터에게 공격 적중 시.*8초 동안 대상의 방어력을\s*([\d.]+)%/,
  },

  {
    regex: /적에게 공격 적중 시.*대상의 치명타 피해 저항력을\s*[\d.]+%\s*감소/,
    shortName: "회심",
    color: "text-pink-400",
    valueRegex: /치명타 피해 저항력을\s*([\d.]+)%/,
  },
  {
    regex:
      /치명타\s*저항을\s*[\d.]+%\s*감소시킨다\.\s*해당\s*효과는\s*한\s*파티\s*당\s*하나만\s*적용된다\.\s*아군\s*공격력\s*강화\s*효과가\s*[\d.]+%\s*증가한다/,
    shortName: "약노",
    color: "text-pink-400",
    valueRegex: /치명타\s*저항을\s*([\d.]+)%/,
  },
  {
    regex:
      /보호\s*효과\(보호막,\s*생명력\s*회복,\s*받는\s*피해\s*감소\)가\s*적용된\s*대상이\s*5초\s*동안\s*적에게\s*주는\s*피해가\s*[\d.]+%\s*증가한다\.\s*해당\s*효과는\s*한\s*파티\s*당\s*하나만\s*적용되며.*아군\s*공격력\s*강화\s*효과가\s*[\d.]+%\s*증가한다/,
    shortName: "응원",
    color: "text-green-400",
    valueRegex: /주는\s*피해가\s*([\d.]+)%/,
  },
  {
    regex:
      /치명타\s*피해\s*저항을\s*[\d.]+%\s*감소시킨다\.\s*해당\s*효과는\s*한\s*파티\s*당\s*하나만\s*적용된다\.\s*아군\s*공격력\s*강화\s*효과가\s*[\d.]+%\s*증가한다/,
    shortName: "파회",
    color: "text-green-400",
    valueRegex: /치명타\s*피해\s*저항을\s*([\d.]+)%/,
  },

  // ========== 서폿 단일옵 ==========
  {
    regex: /파티원 보호 및 회복.*효과가\s*[\d.]+%\s*증가/,
    shortName: "보회",
    color: "text-cyan-400",
    valueRegex: /효과가\s*([+\d.]+)%/,
  },
  {
    regex: /아군 공격력 강화 효과\s*[+\d.]+%/,
    shortName: "아공강",
    color: "text-green-400",
    valueRegex: /아군 공격력 강화 효과\s*([\d.]+)%/,
  },
  {
    regex: /아군 피해량 강화 효과\s*[+\d.]+%/,
    shortName: "아피강",
    color: "text-green-400",
    valueRegex: /효과\s*([+\d.]+)%/,
  },

  // ========== 고정옵 ==========
  {
    regex: /(?<!,\s*)공격\s*및\s*이동\s*속도가\s*[\d,.]+\s*%\s*증가한다/,
    shortName: "공이속",
    color: "text-green-400",
    valueRegex: /공격\s*및\s*이동\s*속도가\s*([\d,.]+)\s*%/,
  },
  {
    regex: /이동기 및 기상기 재사용 대기 시간이\s*[\d.]+%\s*감소/,
    shortName: "도망가",
    color: "text-blue-400",
    valueRegex: /시간이\s*([\d.]+)%/,
  },
  {
    regex: /전투\s*자원\s*회복.*[\d.]+%\s*증가/,
    shortName: "자원회복",
    color: "text-blue-400",
    valueRegex: /회복.*\s*([\d.]+)%/,
  },
  {
    regex: /공격 적중 시\s*[\d]+초 동안 경직 및 피격/,
    shortName: "슈퍼아머",
    color: "text-yellow-400",
    valueRegex: /적중 시\s*([\d]+)초/,
  },
  {
    regex: /최대 생명력/,
    shortName: "최생",
    color: "text-red-400",
    valueRegex: /생명력이\s*([\d,]+)/,
  },
];

export function parseBraceletEffects(effectText: string): {
  stats: BraceletStat[];
  effects: BraceletEffect[];
} {
  const result = {
    stats: [] as BraceletStat[],
    effects: [] as BraceletEffect[],
  };

  // 1. 스탯 추출 (기존 로직 유지)
  const statPatterns = [
    { name: "지능", regex: /지능 \+(\d+)/, color: "text-amber-400" },
    { name: "힘", regex: /힘 \+(\d+)/, color: "text-red-400" },
    { name: "민첩", regex: /민첩 \+(\d+)/, color: "text-green-400" },
    { name: "특화", regex: /특화 \+(\d+)/, color: "text-blue-400" },
    { name: "치명", regex: /치명 \+(\d+)/, color: "text-orange-400" },
    { name: "신속", regex: /신속 \+(\d+)/, color: "text-lime-400" },
    { name: "제압", regex: /제압 \+(\d+)/, color: "text-purple-400" },
    { name: "인내", regex: /인내 \+(\d+)/, color: "text-green-400" },
    { name: "숙련", regex: /숙련 \+(\d+)/, color: "text-cyan-400" },
    { name: "체력", regex: /체력 \+(\d+)/, color: "text-red-300" },
  ];

  statPatterns.forEach(({ name, regex, color }) => {
    const match = effectText.match(regex);
    if (match) {
      result.stats.push({ name, value: match[1], color });
    }
  });

  let remainingText = effectText.replace(/\n/g, " ");
  const matchedPatterns = new Set<string>();

  for (const pattern of effectPatterns) {
    const match = remainingText.match(pattern.regex);

    if (match && !matchedPatterns.has(pattern.shortName)) {
      matchedPatterns.add(pattern.shortName);

      const matchedFragment = match[0];

      let value = 0;
      const valueMatch = matchedFragment.match(pattern.valueRegex);
      if (valueMatch && valueMatch[1]) {
        value = parseFloat(valueMatch[1].replace(/,/g, ""));
      }

      const { tier, tierColor } = getEffectTier(value, pattern.shortName);

      result.effects.push({
        type: pattern.shortName,
        fullDescription: pattern.shortName,
        shortName: pattern.shortName,
        color: pattern.color,
        tier,
        tierColor,
      });

      remainingText = remainingText.replace(matchedFragment, " [처리완료] ");
    }
  }

  return result;
}

// 팔찌 최대값 상수
export const BRACELET_MAX_VALUES = {
  특성: 120,
  힘민지: 16000,
  체력: 6000,
  최생: 14000,
} as const;
