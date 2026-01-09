export function CharacterGems({ gemsData }: { gemsData: any }) {
  if (!gemsData?.Effects?.Skills || !gemsData?.Gems) return null;

  // 레벨별 배경색
  const getGemBgColor = (level: number) => {
    if (level >= 10) return "bg-gradient-to-br from-[#3d3325] to-[#dcc999]";
    if (level >= 8)
      return "bg-gradient-to-br from-[#341a09] to-[#a24006] border-orange-700/50";
    return "bg-gradient-to-br from-[#362003] to-[#9e5f04] border-amber-800/50";
  };

  // 딜증과 쿨감 분리
  const damageGems = gemsData.Effects.Skills.filter((skill: any) =>
    skill.Description?.[0]?.includes("증가")
  ).map((skill: any) => {
    const gem = gemsData.Gems.find((g: any) => g.Slot === skill.GemSlot);
    return { skill, gem };
  });

  const cooldownGems = gemsData.Effects.Skills.filter((skill: any) =>
    skill.Description?.[0]?.includes("감소")
  ).map((skill: any) => {
    const gem = gemsData.Gems.find((g: any) => g.Slot === skill.GemSlot);
    return { skill, gem };
  });

  return (
    <div className="design-card rounded-lg border border-white/10 p-0">
      <div className="border-b border-white/10 p-3">
        <h3 className="font-bold">보석</h3>
      </div>
      <div className="flex gap-4 space-y-4 p-4">
        {/* 쿨감 */}
        {cooldownGems.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-semibold text-blue-400">
              쿨감 {cooldownGems.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {cooldownGems.map(({ skill, gem }: any, idx: any) => {
                const level = gem?.Level || 0;
                return (
                  <div key={idx} className="group relative">
                    <div
                      className={`relative h-14 w-14 cursor-pointer overflow-hidden rounded border ${getGemBgColor(level)} transition-all hover:scale-105 hover:brightness-110`}
                    >
                      {gem?.Icon && (
                        <img
                          src={gem.Icon}
                          alt={skill.Name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute right-1 bottom-1 rounded bg-black/90 px-1.5 py-0.5 text-xs font-bold text-blue-400">
                        {level}
                      </div>
                    </div>

                    {/* 호버 툴팁 */}
                    <div className="absolute top-full left-0 z-50 mt-2 hidden w-64 rounded-lg border border-gray-700 bg-gray-900/95 p-3 shadow-xl group-hover:block">
                      <div className="mb-2 flex items-center gap-2">
                        <img src={gem?.Icon} className="h-10 w-10 rounded" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                              {level}광
                            </span>
                            <span className="text-sm font-bold text-blue-400">
                              {skill.Name}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-gray-400">
                            {gem?.Grade}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 border-t border-gray-700 pt-2">
                        {skill.Description?.map((desc: string, i: number) => (
                          <div key={i} className="text-xs text-gray-300">
                            {desc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 딜증 */}
        {damageGems.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-semibold text-red-400">
              딜증 {damageGems.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {damageGems.map(({ skill, gem }: any, idx: any) => {
                const level = gem?.Level || 0;
                return (
                  <div key={idx} className="group relative">
                    <div
                      className={`relative h-14 w-14 cursor-pointer overflow-hidden rounded border ${getGemBgColor(level)} transition-all hover:scale-105 hover:brightness-110`}
                    >
                      {gem?.Icon && (
                        <img
                          src={gem.Icon}
                          alt={skill.Name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute right-1 bottom-1 rounded bg-black/90 px-1.5 py-0.5 text-xs font-bold text-red-400">
                        {level}
                      </div>
                    </div>

                    {/* 호버 툴팁 */}
                    <div className="absolute top-full left-0 z-50 mt-2 hidden w-64 rounded-lg border border-gray-700 bg-gray-900/95 p-3 shadow-xl group-hover:block">
                      <div className="mb-2 flex items-center gap-2">
                        <img src={gem?.Icon} className="h-10 w-10 rounded" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                              {level}광
                            </span>
                            <span className="text-sm font-bold text-red-400">
                              {skill.Name}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-gray-400">
                            {gem?.Grade}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 border-t border-gray-700 pt-2">
                        {skill.Description?.map((desc: string, i: number) => (
                          <div key={i} className="text-xs text-gray-300">
                            {desc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
