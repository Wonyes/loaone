// components/CharacterBracelet.tsx
import { parseBraceletEffects } from "@/utils/braceletParser";

export function CharacterBracelet({ item }: { item: any }) {
  const braceletEffect = item.tooltip?.Element_005?.value?.Element_001;
  if (!braceletEffect) return null;

  const { stats, effects } = parseBraceletEffects(braceletEffect);

  return (
    <div className="">
      {/* 스탯 한 줄 */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{stat.name}</span>
            <span className={`text-xs font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* 효과 뱃지 (티어 색상 적용) */}
      <div className="flex flex-wrap gap-1.5">
        {effects.map((effect, idx) => (
          <span
            key={idx}
            className={`rounded border border-gray-700/50 bg-gray-800/50 text-xs font-medium ${effect.tierColor}`}
            title={effect.fullDescription}
          >
            {effect.shortName}+ {effect.tier}
          </span>
        ))}
      </div>
    </div>
  );
}
