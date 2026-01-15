export interface CollectibleInfo {
  name: string;
  type: string;
  grade: string;
  level: number; // +25, +9 등
  tier?: number; // 티어 (고대 장비용)
  refinementStep: number; // 상급재련 단계
  icon: string;
}

export function parseCollectibleItem(item: any): CollectibleInfo {
  const tooltip = item.tooltip;
  const leftStr2 = tooltip?.Element_001?.value?.leftStr2 || "";

  // 이름에서 강화 레벨 추출 (+25, +9 등)
  const levelMatch = item.Name?.match(/\+(\d+)/);
  const level = levelMatch ? parseInt(levelMatch[1]) : 0;

  // 티어 확인 (고대 등급에만 있음)
  const tierMatch = leftStr2.match(/티어\s*(\d+)/);
  const tier = tierMatch ? parseInt(tierMatch[1]) : undefined;

  // 상급재련 단계 파싱
  let refinementStep = 0;

  // Element_005 또는 Element_006에서 상급재련 정보 찾기
  const element005 = tooltip?.Element_005?.value;
  const element006 = tooltip?.Element_006?.value;

  // Element_005가 객체인 경우
  if (element005) {
    const element005Text =
      typeof element005 === "string" ? element005 : JSON.stringify(element005);

    const refinementMatch =
      element005Text.match(/상급 재련 적용 \((\d+)단계\)/);
    if (refinementMatch) {
      refinementStep = parseInt(refinementMatch[1]);
    }
  }

  // Element_006에서도 확인 (데이터 구조가 다를 수 있음)
  if (refinementStep === 0 && element006) {
    const element006Text =
      typeof element006 === "string" ? element006 : JSON.stringify(element006);

    const refinementMatch =
      element006Text.match(/상급 재련 적용 \((\d+)단계\)/);
    if (refinementMatch) {
      refinementStep = parseInt(refinementMatch[1]);
    }
  }

  return {
    name: item.Name || "",
    type: item.Type?.replace(/\s/g, "") || "",
    grade: item.Grade || "",
    level,
    tier,
    refinementStep,
    icon: item.Icon || "",
  };
}
