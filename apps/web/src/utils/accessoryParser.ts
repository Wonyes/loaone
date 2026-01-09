export interface AccessoryStat {
  name: string;
  value: string;
  tier: "상" | "중" | "하";
  tierColor: string;
}

// 옵션별 티어 기준값
const TIER_RANGES: Record<string, { low: number; mid: number; high: number }> =
  {
    "최대 생명력": { low: 1300, mid: 3250, high: 6500 },
    공격력: { low: 80, mid: 195, high: 390 },
    무기공격력: { low: 195, mid: 480, high: 960 },
    "무기 공격력": { low: 195, mid: 480, high: 960 },
    "최대 마나": { low: 6, mid: 15, high: 30 },
    "전투 중 생명력 회복량": { low: 10, mid: 25, high: 50 },

    "상태이상 공격 지속시간": { low: 0.2, mid: 0.5, high: 1.0 },

    "적에게 주는 피해": { low: 0.55, mid: 1.2, high: 2.0 },
    "추가 피해": { low: 0.7, mid: 1.6, high: 2.6 },
    낙인력: { low: 2.15, mid: 4.8, high: 8.0 },
    "세레나데, 신앙, 조화 게이지 획득량": { low: 1.6, mid: 3.6, high: 6.0 },

    "파티원 회복 효과": { low: 0.95, mid: 2.1, high: 3.5 },
    "파티원 보호막 효과": { low: 0.95, mid: 2.1, high: 3.5 },

    "아군 공격력 강화 효과": { low: 1.35, mid: 3.0, high: 5.0 },
    "아군 피해량 강화 효과": { low: 2.0, mid: 4.5, high: 7.5 },
    "치명타 적중률": { low: 0.4, mid: 0.95, high: 1.55 },
    "치명타 피해": { low: 1.1, mid: 2.4, high: 4.0 },
  };

function getOptionTier(
  optionName: string,
  value: number
): { tier: "상" | "중" | "하"; tierColor: string } {
  const normalizedName = optionName.replace(/\s*%?\s*\+?$/, "").trim();
  const range = TIER_RANGES[normalizedName];

  if (!range) {
    return { tier: "중", tierColor: "text-purple-400" };
  }

  if (value >= range.high) return { tier: "상", tierColor: "text-amber-400" };
  if (value >= range.mid) return { tier: "중", tierColor: "text-purple-400" };
  return { tier: "하", tierColor: "text-blue-400" };
}

export function parseAccessoryOptions(tooltip: any): AccessoryStat[] {
  const stats: AccessoryStat[] = [];

  if (!tooltip?.Element_006?.value) return stats;

  const element001 = tooltip.Element_006.value.Element_001;
  if (!element001) return stats;

  const text =
    typeof element001 === "string" ? element001 : JSON.stringify(element001);

  // % 포함 옵션과 숫자만 있는 옵션을 한 번에 매칭
  const allMatches = text.matchAll(/([가-힣\s]+?)\s*\+(\d+\.?\d*)(%)?/g);

  for (const match of allMatches) {
    const [_, name, valueStr, hasPercent] = match;
    const cleanName = name.trim();

    if (!cleanName) continue;

    // 중복 체크
    if (
      stats.some(
        s =>
          s.name === cleanName &&
          s.value === (hasPercent ? `${valueStr}%` : `+${valueStr}`)
      )
    ) {
      continue;
    }

    const value = parseFloat(valueStr);
    const { tier, tierColor } = getOptionTier(cleanName, value);

    stats.push({
      name: cleanName,
      value: hasPercent ? `${valueStr}%` : `+${valueStr}`,
      tier,
      tierColor,
    });
  }

  return stats;
}
