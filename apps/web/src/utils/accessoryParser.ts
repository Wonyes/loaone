export interface AccessoryStat {
  name: string;
  value: string;
  tier: "상" | "중" | "하";
  tierColor: string;
}

// 옵션별 티어 기준값
const TIER_RANGES: Record<string, { low: number; mid: number; high: number }> =
  {
    "추가 피해": { low: 0.7, mid: 3.0, high: 6.3 },
    "적에게 주는 피해": { low: 0.7, mid: 3.0, high: 6.3 },
    공격력: { low: 0.7, mid: 3.0, high: 6.3 },
    무기공격력: { low: 0.7, mid: 3.0, high: 6.3 },
    낙인력: { low: 0.7, mid: 3.0, high: 6.3 },
    "치명타 적중률": { low: 0.7, mid: 3.0, high: 6.3 },
    "치명타 피해": { low: 0.7, mid: 3.0, high: 6.3 },
    "아군 공격력 강화 효과": { low: 0.7, mid: 3.0, high: 6.3 },
    "아군 피해량 강화 효과": { low: 0.7, mid: 3.0, high: 6.3 },
    "최대 생명력": { low: 0.7, mid: 3.0, high: 6.3 },
    "최대 마나": { low: 0.7, mid: 3.0, high: 6.3 },
    "파티원 회복량 효과": { low: 0.7, mid: 3.0, high: 6.3 },
    "파티원 보호막 효과": { low: 0.7, mid: 3.0, high: 6.3 },
  };

function getOptionTier(
  optionName: string,
  value: number
): { tier: "상" | "중" | "하"; tierColor: string } {
  const normalizedName = optionName.replace(/\s*%?\s*\+?$/, "").trim();
  const range = TIER_RANGES[normalizedName];

  if (!range) {
    return { tier: "중", tierColor: "text-blue-400" };
  }

  if (value >= range.high) return { tier: "상", tierColor: "text-amber-400" };
  if (value >= range.mid) return { tier: "중", tierColor: "text-blue-400" };
  return { tier: "하", tierColor: "text-green-400" };
}

export function parseAccessoryOptions(tooltip: any): AccessoryStat[] {
  const stats: AccessoryStat[] = [];

  if (!tooltip?.Element_006?.value) return stats;

  // Element_000 (연마 효과 제목)
  const element000 = tooltip.Element_006.value.Element_000;
  // Element_001 (연마 효과 내용)
  const element001 = tooltip.Element_006.value.Element_001;

  if (!element001) return stats;

  // 텍스트에서 옵션 파싱
  // 예: "아군 공격력 강화 효과 +5.00%랜덤 피해 +1.10%무기 공격력 +195"
  const text = element001;

  // % 있는 옵션들
  const percentMatches = text.matchAll(/([가-힣\s]+?)\s+\+([\d.]+)%/g);
  for (const match of percentMatches) {
    const [_, name, valueStr] = match;
    const cleanName = name.trim();
    const value = parseFloat(valueStr);
    const { tier, tierColor } = getOptionTier(cleanName, value);

    stats.push({
      name: cleanName,
      value: `${valueStr}%`,
      tier,
      tierColor,
    });
  }

  // 숫자만 있는 옵션들 (무기 공격력 등)
  const numberMatches = text.matchAll(/([가-힣\s]+?)\s+\+(\d+)(?![\d%])/g);
  for (const match of numberMatches) {
    const [_, name, valueStr] = match;
    const cleanName = name.trim();

    // 이미 추가된 옵션은 스킵
    if (stats.some(s => s.name === cleanName)) continue;

    stats.push({
      name: cleanName,
      value: `+${valueStr}`,
      tier: "중",
      tierColor: "text-blue-400",
    });
  }

  return stats;
}
