// utils/braceletParser.ts

export interface BraceletStat {
  name: string;
  value: string;
  color: string;
}

export interface BraceletEffect {
  type: string;
  fullDescription: string;
  shortName: string;
  category: "fixed" | "combat" | "support";
  color: string;
  tier: "하" | "중" | "상";
  tierColor: string;
}

// 효과별 티어 판단 함수
function getEffectTier(
  effectText: string,
  shortName: string
): { tier: "하" | "중" | "상"; tierColor: string } {
  // 수치 추출을 위한 정규식
  const percentMatch = effectText.match(/([\d.]+)%/);
  const numberMatch = effectText.match(/(\d+)/);

  const tierRanges: Record<string, { low: number; mid: number; high: number }> =
    {
      비수: { low: 1.8, mid: 2.1, high: 2.5 },
      달인: { low: 1.8, mid: 2.1, high: 2.5 },
      회심: { low: 3.6, mid: 4.2, high: 4.8 },
      아공강: { low: 2, mid: 2.5, high: 3 },
      아피강: { low: 6, mid: 7.5, high: 9 },
      보회: { low: 2.5, mid: 3, high: 3.5 },
      "치적+피증": { low: 3.4, mid: 4.2, high: 5.0 },
      "치피+피증": { low: 6.8, mid: 8.4, high: 10 },
      "피증+무력피증": { low: 2, mid: 2.5, high: 3 },
      "추피+악마": { low: 2.5, mid: 3, high: 3.5 },
      "쿨증+피증": { low: 4.5, mid: 5, high: 5.5 },
      사멸: { low: 2.5, mid: 3, high: 3.5 },
      결대: { low: 2.5, mid: 3, high: 3.5 },
      타대: { low: 2.5, mid: 3, high: 3.5 },
      치적: { low: 3.4, mid: 4.2, high: 5.0 },
      치피: { low: 6.8, mid: 8.4, high: 10 },
      추피: { low: 3, mid: 3.5, high: 4 },
      공이속: { low: 4, mid: 5, high: 6 },
      자원회복: { low: 8, mid: 10, high: 12 },
      슈퍼아머: { low: 80, mid: 70, high: 60 }, // 슈퍼아머는 낮을수록 좋음
      무공6중첩: { low: 1160, mid: 1320, high: 1480 },
      "무공+조건무공": { low: 7200, mid: 8100, high: 9000 },
      무공30중첩: { low: 6900, mid: 7800, high: 8700 },
    };

  const range = tierRanges[shortName];
  if (!range) {
    return { tier: "중", tierColor: "text-blue-400" };
  }

  let value: number;
  if (percentMatch) {
    value = parseFloat(percentMatch[1]);
  } else if (numberMatch) {
    value = parseInt(numberMatch[1].replace(/,/g, ""));
  } else {
    return { tier: "중", tierColor: "text-blue-400" };
  }

  // 슈퍼아머는 반대로 판단 (낮을수록 상옵)
  if (shortName === "슈퍼아머") {
    if (value <= range.high) return { tier: "상", tierColor: "text-amber-400" };
    if (value <= range.mid) return { tier: "중", tierColor: "text-blue-400" };
    return { tier: "하", tierColor: "text-green-400" };
  }

  // 일반적인 경우
  if (value >= range.high) return { tier: "상", tierColor: "text-amber-400" };
  if (value >= range.mid) return { tier: "중", tierColor: "text-blue-400" };
  return { tier: "하", tierColor: "text-green-400" };
}

export function parseBraceletEffects(effectText: string): {
  stats: BraceletStat[];
  effects: BraceletEffect[];
} {
  const result = {
    stats: [] as BraceletStat[],
    effects: [] as BraceletEffect[],
  };

  // 스탯 추출
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

  // 효과 감지
  const effectPatterns = [
    {
      check: (text: string) =>
        text.includes("방어력") &&
        text.includes("감소") &&
        text.includes("아군 공격력 강화"),
      shortName: "비수",
      category: "support" as const,
      color: "text-pink-400",
    },
    {
      check: (text: string) =>
        text.includes("치명타 저항력") &&
        text.includes("감소") &&
        text.includes("아군 공격력 강화"),
      shortName: "달인",
      category: "support" as const,
      color: "text-pink-400",
    },
    {
      check: (text: string) =>
        text.includes("치명타 피해 저항력") &&
        text.includes("감소") &&
        text.includes("아군 공격력 강화"),
      shortName: "회심",
      category: "support" as const,
      color: "text-pink-400",
    },
    {
      check: (text: string) =>
        text.includes("보호 효과가 적용된") &&
        text.includes("아군 공격력 강화"),
      shortName: "보호버프",
      category: "support" as const,
      color: "text-green-400",
    },
    {
      check: (text: string) =>
        text.includes("치명타 적중률") && text.includes("치명타로 적중 시"),
      shortName: "치적+피증",
      category: "combat" as const,
      color: "text-orange-400",
    },
    {
      check: (text: string) =>
        text.includes("치명타 피해가") && text.includes("치명타로 적중 시"),
      shortName: "치피+피증",
      category: "combat" as const,
      color: "text-red-400",
    },
    {
      check: (text: string) => text.includes("무력화 상태의 적"),
      shortName: "피증+무력피증",
      category: "combat" as const,
      color: "text-red-400",
    },
    {
      check: (text: string) => text.includes("악마 및 대악마"),
      shortName: "추피+악마",
      category: "combat" as const,
      color: "text-purple-400",
    },
    {
      check: (text: string) => text.includes("재사용 대기시간이 2% 증가"),
      shortName: "쿨증+피증",
      category: "combat" as const,
      color: "text-red-500",
    },
    {
      check: (text: string) =>
        text.includes("최대 6중첩") || text.includes("최대6중첩"),
      shortName: "무공6중첩",
      category: "combat" as const,
      color: "text-yellow-400",
    },
    {
      check: (text: string) => text.includes("생명력이 50% 이상"),
      shortName: "무공+조건무공",
      category: "combat" as const,
      color: "text-yellow-400",
    },
    {
      check: (text: string) =>
        text.includes("최대 30중첩") || text.includes("최대30중첩"),
      shortName: "무공30중첩",
      category: "combat" as const,
      color: "text-yellow-400",
    },
    {
      check: (text: string) => text.includes("백어택"),
      shortName: "사멸",
      category: "combat" as const,
      color: "text-blue-400",
    },
    {
      check: (text: string) => text.includes("헤드어택"),
      shortName: "결대",
      category: "combat" as const,
      color: "text-blue-400",
    },
    {
      check: (text: string) => text.includes("방향성 공격이 아닌"),
      shortName: "타대",
      category: "combat" as const,
      color: "text-cyan-400",
    },
    {
      check: (text: string) => text.includes("파티원 보호 및 회복"),
      shortName: "보회",
      category: "support" as const,
      color: "text-cyan-400",
    },
    {
      check: (text: string) =>
        text.includes("아군 피해량 강화") && !text.includes("보호 효과"),
      shortName: "아피강",
      category: "support" as const,
      color: "text-green-400",
    },
    {
      check: (text: string) => {
        if (!text.includes("아군 공격력 강화")) return false;
        if (text.includes("방어력") && text.includes("감소")) return false;
        if (text.includes("치명타 저항력") && text.includes("감소"))
          return false;
        if (text.includes("치명타 피해 저항력") && text.includes("감소"))
          return false;
        if (text.includes("보호 효과가 적용된")) return false;
        return true;
      },
      shortName: "아공강",
      category: "support" as const,
      color: "text-green-400",
    },
    {
      check: (text: string) =>
        text.includes("치명타 적중률") && !text.includes("치명타로 적중 시"),
      shortName: "치적",
      category: "combat" as const,
      color: "text-orange-400",
    },
    {
      check: (text: string) =>
        text.includes("치명타 피해") &&
        !text.includes("저항력") &&
        !text.includes("치명타로 적중 시"),
      shortName: "치피",
      category: "combat" as const,
      color: "text-red-400",
    },
    {
      check: (text: string) =>
        text.includes("추가 피해") && !text.includes("악마"),
      shortName: "추피",
      category: "combat" as const,
      color: "text-purple-400",
    },
    {
      check: (text: string) => text.includes("공격 및 이동속도"),
      shortName: "공이속",
      category: "fixed" as const,
      color: "text-green-400",
    },
    {
      check: (text: string) =>
        text.includes("전투 자원 회복") || text.includes("전투자원회복"),
      shortName: "자원회복",
      category: "fixed" as const,
      color: "text-blue-400",
    },
    {
      check: (text: string) => text.includes("경직 및 피격이상에 면역"),
      shortName: "슈퍼아머",
      category: "fixed" as const,
      color: "text-yellow-400",
    },
  ];

  const matchedEffect = effectPatterns.find(pattern =>
    pattern.check(effectText)
  );

  if (matchedEffect) {
    const { tier, tierColor } = getEffectTier(
      effectText,
      matchedEffect.shortName
    );

    result.effects.push({
      type: matchedEffect.shortName,
      fullDescription: effectText,
      shortName: matchedEffect.shortName,
      category: matchedEffect.category,
      color: matchedEffect.color,
      tier,
      tierColor,
    });
  }

  return result;
}
