import { parseBraceletEffects } from "@/utils/braceletParser";

export function CharacterBracelet({ item }: { item: any }) {
  const braceletEffect = item.tooltip?.Element_005?.value?.Element_001;
  if (!braceletEffect) return null;

  const { stats, effects } = parseBraceletEffects(braceletEffect);

  return (
    <div className="space-y-2">
      {stats.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">{stat.name}</span>
              <span className={`text-xs font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {effects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {effects.map((effect, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold transition-colors hover:brightness-110 ${effect.tierColor} border-gray-700/50 bg-gray-800/50`}
              title={effect.fullDescription}
            >
              {effect.shortName} +{effect.tier}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
