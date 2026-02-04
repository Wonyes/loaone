import { parseBraceletEffects } from "@/utils/braceletParser";
import { cn } from "@/lib/utils";

export function CharacterBracelet({ item }: { item: any }) {
  const braceletEffect = item.tooltip?.Element_005?.value?.Element_001;

  if (!braceletEffect) return null;

  const { stats, effects } = parseBraceletEffects(braceletEffect);

  return (
    <div className="space-y-1 p-1">
      {stats.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{stat.name}</span>
              <span className="text-xs font-bold text-white">
                +{stat.value}
              </span>
            </div>
          ))}
        </div>
      )}
      {effects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {effects.map((effect, idx) => (
            <span
              key={idx}
              className={cn(
                "inline-flex items-center rounded-md border border-gray-700/50 bg-gray-800/50 px-2 py-1 text-[10px] font-bold",
                effect.tierColor
              )}
            >
              {effect.shortName.replace("+", "")} {effect.tier}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
