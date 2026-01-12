"use client";

import { GRADE_STYLES } from "@/constants/lostark/styles";
import { SectionHeader } from "./CharacterPage";

export function CharacterGems({ gemsData }: { gemsData: any }) {
  if (!gemsData?.Effects?.Skills || !gemsData?.Gems) return null;

  // 보석 등급 스타일 가져오기
  const getGradeStyle = (gem: any) => {
    // API 데이터에 따라 gem.Grade 또는 gem.Level 기준으로 판단
    const level = gem?.Level || 0;
    if (level >= 10) return GRADE_STYLES.고대;
    if (level >= 8) return GRADE_STYLES.유물;
    return GRADE_STYLES.전설;
  };

  // 1. 데이터 필터링 로직 (유형별로 미리 분류)
  const filterGems = (keyword: string) => {
    return gemsData.Effects.Skills.filter((skill: any) =>
      skill.Description?.[0]?.includes(keyword)
    )
      .map((skill: any) => ({
        skill,
        gem: gemsData.Gems.find((g: any) => g.Slot === skill.GemSlot),
      }))
      .filter((item: any) => item.gem); // 보석 데이터가 있는 것만
  };

  const gemGroups = [
    {
      title: "쿨감",
      color: "text-blue-400",
      gems: filterGems("감소"),
    },
    {
      title: "딜증",
      color: "text-red-400",
      gems: filterGems("증가"),
    },
  ];

  return (
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="보석" />
      <div className="flex flex-col gap-6 p-4 sm:flex-row">
        {gemGroups.map((group, gIdx) => (
          <div key={gIdx} className="min-w-0">
            <div className={`mb-2 text-xs font-semibold ${group.color}`}>
              {group.title} {group.gems.length}
            </div>

            <div className="flex gap-1">
              {group.gems.map(({ skill, gem }: any, idx: number) => {
                const gradeStyle = getGradeStyle(gem);
                return (
                  <GemItem
                    key={idx}
                    skill={skill}
                    gem={gem}
                    gradeStyle={gradeStyle}
                    labelColor={group.color}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 재사용을 위한 개별 보석 아이템 컴포넌트
function GemItem({ skill, gem, gradeStyle, labelColor }: any) {
  return (
    <div className="group relative">
      <div
        className={`relative h-14 w-14 cursor-pointer overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border} z-0 transition-all hover:z-10 hover:scale-110 hover:brightness-125`}
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

      {/* 호버 툴팁 (KLOA 스타일로 최적화) */}
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
        {/* 화살표 모양 */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}
