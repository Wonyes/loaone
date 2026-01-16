"use client";

import { Card } from "../common/Card";
import { Zap, Activity, Swords, Target, BarChart3 } from "lucide-react";
import { SkillItem } from "./skill/SkillItem";
import {
  useCGems,
  useCSkills,
} from "@/hooks/query/lostark/character/useLostarkApi";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CharacterSkillPageProps {
  name: string;
  stats: any[];
  usingSkillPoint: string;
  totalSkillPoint: string;
  mainPassiveName: string;
}

export function CharacterSkillPage({
  name,
  stats,
  usingSkillPoint,
  totalSkillPoint,
  mainPassiveName,
}: CharacterSkillPageProps) {
  const { data: gemsData } = useCGems(name);
  const { data: skillData } = useCSkills(name);

  const { top1, top2 } = useTopStats(stats);
  const activeSkills = useActiveSkills(skillData, gemsData);

  return (
    <article className="w-full max-w-[1400px] antialiased">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        <aside className="col-span-1 grid grid-cols-2 gap-3 sm:gap-6 lg:sticky lg:top-24 lg:col-span-1 lg:h-fit lg:grid-cols-1">
          <CombatStatsCard
            top1={top1}
            top2={top2}
            mainPassiveName={mainPassiveName}
          />
          <SkillPointsCard
            usingSkillPoint={usingSkillPoint}
            totalSkillPoint={totalSkillPoint}
          />
        </aside>

        <main className="col-span-1 lg:col-span-3 xl:col-span-4">
          <SkillListCard activeSkills={activeSkills} gemsData={gemsData} />
        </main>
      </div>
    </article>
  );
}

function useActiveSkills(skillData: any[], gemsData: any) {
  return useMemo(() => {
    if (!skillData) return [];

    const gemSkillNames = new Set(
      gemsData?.Effects?.Skills?.map((skill: any) => skill.Name).filter(
        Boolean
      ) || []
    );

    const filtered = skillData.filter(
      (s: any) => s.Level > 1 || s.Rune !== null || gemSkillNames.has(s.Name)
    );

    return filtered.sort((a: any, b: any) => {
      const aHasTripods = a.Tripods?.some((t: any) => t.IsSelected) ? 1 : 0;
      const bHasTripods = b.Tripods?.some((t: any) => t.IsSelected) ? 1 : 0;
      return bHasTripods - aHasTripods;
    });
  }, [skillData, gemsData]);
}

function useTopStats(stats: any[]) {
  return useMemo(() => {
    if (!stats || !Array.isArray(stats)) {
      return {
        top1: { Type: "—", Value: "0" },
        top2: { Type: "—", Value: "0" },
      };
    }

    const topStats = [...stats]
      .map(s => ({ ...s, numValue: Number(s.Value.replace(/,/g, "")) }))
      .filter(s =>
        ["치명", "특화", "신속", "제압", "인내", "숙련"].includes(s.Type)
      )
      .sort((a, b) => b.numValue - a.numValue)
      .slice(0, 2);

    return {
      top1: topStats[0] || { Type: "—", Value: "0" },
      top2: topStats[1] || { Type: "—", Value: "0" },
    };
  }, [stats]);
}

function CombatStatsCard({
  top1,
  top2,
  mainPassiveName,
}: {
  top1: any;
  top2: any;
  mainPassiveName: string;
}) {
  return (
    <Card
      title="Combat Stats"
      icon={<BarChart3 size={16} className="text-indigo-400" />}
      headerAction={<Activity size={14} className="text-indigo-500/50" />}
      className="overflow-hidden bg-white/[0.01]"
    >
      <section className="flex gap-4 p-4 sm:gap-6 sm:p-6">
        <StatDisplay
          label={top1.Type}
          value={top1.Value}
          accent="bg-indigo-500"
          isMain
        />
        <StatDisplay
          label={top2.Type}
          value={top2.Value}
          accent="bg-slate-500"
        />
      </section>
      <footer className="border-t border-indigo-500/10 bg-indigo-500/5 p-3">
        <h3 className="mb-1 text-center text-[10px] font-black tracking-widest text-indigo-400 uppercase sm:text-[11px]">
          Main Engraving
        </h3>
        <p className="text-center text-xs font-bold text-slate-100 sm:text-sm">
          {mainPassiveName || "Standard"}
        </p>
      </footer>
    </Card>
  );
}

function SkillPointsCard({
  usingSkillPoint,
  totalSkillPoint,
}: {
  usingSkillPoint: string;
  totalSkillPoint: string;
}) {
  const percentage = (Number(usingSkillPoint) / Number(totalSkillPoint)) * 100;

  return (
    <Card
      title="Skill Points"
      icon={<Zap size={16} className="text-amber-400" />}
    >
      <section className="p-4 sm:p-6">
        <header className="mb-3 flex items-baseline justify-between">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:text-[11px]">
            Available
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-white sm:text-2xl">
              {usingSkillPoint}
            </span>
            <span className="text-[11px] font-bold text-slate-500 sm:text-xs">
              / {totalSkillPoint}
            </span>
          </div>
        </header>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 sm:h-2"
          role="progressbar"
          aria-valuenow={Number(usingSkillPoint)}
          aria-valuemin={0}
          aria-valuemax={Number(totalSkillPoint)}
        >
          <div
            className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </section>
    </Card>
  );
}

function SkillListCard({
  activeSkills,
  gemsData,
}: {
  activeSkills: any[];
  gemsData: any;
}) {
  const getSkillGems = (skillName: string) => {
    if (!gemsData?.Effects?.Skills) return [];

    const skillGemSlots = gemsData.Effects.Skills.filter(
      (skill: any) => skill.Name === skillName
    ).map((skill: any) => skill.GemSlot);

    return (
      gemsData.Gems?.filter((gem: any) => skillGemSlots.includes(gem.Slot)) ||
      []
    );
  };

  return (
    <Card
      title="Combat Skill Settings"
      icon={<Swords size={18} className="text-slate-400" />}
      headerAction={
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2 py-1 sm:gap-3 sm:px-3 sm:py-1.5">
          <span className="text-[9px] font-black tracking-widest text-slate-200 uppercase sm:text-[10px]">
            {activeSkills.length} Slots Active
          </span>
        </div>
      }
    >
      <header className="hidden grid-cols-12 border-b border-white/5 bg-white/[0.01] px-6 py-3 md:grid">
        <div className="col-span-3 text-[10px] font-black tracking-widest text-slate-300 uppercase">
          Skill Identity
        </div>
        <div className="col-span-6 border-x border-white/5 text-center text-[10px] font-black tracking-widest text-slate-300 uppercase">
          Selected Tripods
        </div>
        <div className="col-span-3 text-right text-[10px] font-black tracking-widest text-slate-300 uppercase">
          Runes & Gems
        </div>
      </header>

      <section className="flex flex-col divide-y divide-white/[0.03] p-0.5 sm:p-1">
        {activeSkills.length > 0 ? (
          <ul>
            {activeSkills.map((skill: any, idx: number) => (
              <li key={`${skill.Name}-${idx}`}>
                <SkillItem skill={skill} gems={getSkillGems(skill.Name)} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState />
        )}
      </section>
    </Card>
  );
}

function StatDisplay({
  label,
  value,
  accent,
  isMain,
}: {
  label: string;
  value: string;
  accent: string;
  isMain?: boolean;
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-1 w-1 rounded-full",
            accent,
            isMain && "shadow-[0_0_8px_#6366f1]"
          )}
          aria-hidden="true"
        />
        <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase sm:text-[11px]">
          {label}
        </span>
      </div>
      <span
        className={cn(
          "font-mono text-2xl font-black tracking-tighter sm:text-3xl",
          isMain ? "text-white" : "text-slate-300"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-800 sm:py-40">
      <Target
        size={40}
        className="mb-4 animate-pulse opacity-10 sm:h-12 sm:w-12"
      />
      <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-20 sm:text-xs sm:tracking-[0.4em]">
        Awaiting Data
      </p>
    </div>
  );
}
