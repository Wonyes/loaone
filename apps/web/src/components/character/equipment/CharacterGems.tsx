"use client";

import { GRADE_STYLES } from "@/constants/lostark/styles";
import { Card } from "../../common/Card";

export function CharacterGems({ gemsData }: { gemsData: any }) {
  if (!gemsData?.Effects?.Skills || !gemsData?.Gems) return null;

  const getGradeStyle = (gem: any) => {
    const level = gem?.Level || 0;
    if (level >= 10) return GRADE_STYLES.고대;
    if (level >= 8) return GRADE_STYLES.유물;
    return GRADE_STYLES.전설;
  };

  const filterGems = (keyword: string) => {
    return gemsData.Effects.Skills.filter((skill: any) =>
      skill.Description?.[0]?.includes(keyword)
    )
      .map((skill: any) => ({
        skill,
        gem: gemsData.Gems.find((g: any) => g.Slot === skill.GemSlot),
      }))
      .filter((item: any) => item.gem);
  };

  const cooldownGems = filterGems("감소");
  const damageGems = filterGems("증가");
  const totalGems = cooldownGems.length + damageGems.length;

  return (
    <Card title="보석">
      <div className="p-4">
        {/* 1줄, 균등 분할, 구분선 */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${totalGems}, 1fr)` }}
        >
          {/* 쿨감 보석 */}
          {cooldownGems.map(({ skill, gem }: any, idx: number) => {
            const gradeStyle = getGradeStyle(gem);
            return (
              <div key={`cool-${idx}`} className="relative">
                {idx === 0 && (
                  <div className="absolute -top-6 left-0 text-xs font-semibold whitespace-nowrap text-blue-400">
                    쿨감 {cooldownGems.length}
                  </div>
                )}
                <GemItem
                  skill={skill}
                  gem={gem}
                  gradeStyle={gradeStyle}
                  labelColor="text-blue-400"
                />
              </div>
            );
          })}

          {/* 딜증 보석 */}
          {damageGems.map(({ skill, gem }: any, idx: number) => {
            const gradeStyle = getGradeStyle(gem);
            return (
              <div key={`dmg-${idx}`} className="relative">
                {idx === 0 && (
                  <div className="absolute -top-6 left-0 text-xs font-semibold whitespace-nowrap text-red-400">
                    딜증 {damageGems.length}
                  </div>
                )}
                <GemItem
                  skill={skill}
                  gem={gem}
                  gradeStyle={gradeStyle}
                  labelColor="text-red-400"
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function GemItem({ skill, gem, gradeStyle, labelColor }: any) {
  return (
    <div className="group relative">
      <div
        className={`relative aspect-square w-full cursor-pointer overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border} z-0 transition-all hover:z-10 hover:scale-110 hover:brightness-125`}
      >
        {gem?.Icon && (
          <img
            src={gem.Icon}
            alt={skill.Name}
            className="h-full w-full object-cover"
          />
        )}
        <div
          className={`absolute right-0.5 bottom-0.5 rounded bg-black/80 px-1 py-0 text-[11px] font-bold ${labelColor} leading-tight`}
        >
          {gem.Level}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-full left-1/2 z-[100] mb-2 hidden w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-900 p-2 shadow-2xl group-hover:block">
        <div className="text-center">
          <p className="mb-1 text-[12px] font-bold text-white">{skill.Name}</p>
          <div className="border-t border-white/5 pt-1">
            {skill.Description?.map((desc: string, i: number) => (
              <p key={i} className="text-[11px] text-gray-400">
                {desc}
              </p>
            ))}
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}
