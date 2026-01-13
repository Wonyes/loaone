export function getTierNumber(leftStr2: string): number | null {
  if (!leftStr2) return null;
  const match = leftStr2.match(/티어\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function getLevelNumber(leftStr2: string): number | null {
  if (!leftStr2) return null;
  const match = leftStr2.match(/레벨\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function getQualityStyles(qualityValue: number) {
  if (qualityValue === 100)
    return "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-sm";
  if (qualityValue >= 90)
    return "bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-sm";
  if (qualityValue >= 70)
    return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold shadow-sm";
  return "bg-gray-600/80 text-gray-200 font-medium";
}
