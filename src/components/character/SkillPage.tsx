"use client";

import { Card } from "../common/Card";
import { Zap, Swords, Target, BarChart3 } from "lucide-react";
import { SkillItem } from "./skill/SkillItem";
import {
  useGems,
  useSkills,
} from "@/hooks/query/lostark/character/useLostarkApi";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { CharacterGemsSidebar } from "./skill/CharacterGemsSlidebar";
import { SkillPageSkeleton } from "../common/CardSkeleton";

interface CharacterSkillPageProps {
  name: string;
  stats: any[];
  usingSkillPoint: number;
  totalSkillPoint: number;
  mainPassiveName: string;
}

export function CharacterSkillPage({
  name,
  stats,
  usingSkillPoint,
  totalSkillPoint,
  mainPassiveName,
}: CharacterSkillPageProps) {
  const { data: gemsData, isLoading: isGemsLoading } = useGems(name);
  const { data: skillData, isLoading: isSkillLoading } = useSkills(name);

  const { top1, top2 } = useTopStats(stats);
  const activeSkills = useActiveSkills(skillData, gemsData);

  if (isGemsLoading || isSkillLoading) {
    return <SkillPageSkeleton />;
  }

  return (
    <article className="mx-auto w-full max-w-[1400px] antialiased">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="flex flex-col gap-6 lg:col-span-3 xl:col-span-3">
          <div className="flex flex-col gap-6 sm:flex-row lg:top-24 lg:flex-col">
            <CombatStatsCard
              top1={top1}
              top2={top2}
              mainPassiveName={mainPassiveName}
            />
            <SkillPointsCard
              usingSkillPoint={usingSkillPoint}
              totalSkillPoint={totalSkillPoint}
            />
          </div>
        </aside>

        <div className="flex flex-col gap-6 lg:col-span-9 xl:col-span-9">
          <CharacterGemsSidebar gemsData={gemsData} />

          <SkillListCard activeSkills={activeSkills} gemsData={gemsData} />
        </div>
      </div>
    </article>
  );
}

function useActiveSkills(skillData: any[] | undefined, gemsData: any) {
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

function CombatStatsCard({ top1, top2, mainPassiveName }: any) {
  return (
    <Card
      title="Combat Stats"
      icon={<BarChart3 size={16} className="text-indigo-400" />}
      className="w-full overflow-hidden"
    >
      <div className="flex items-center justify-around p-6">
        <StatDisplay
          label={top1.Type}
          value={top1.Value}
          accent="bg-indigo-500"
          isMain
        />
        <div className="h-10 w-px bg-white/5" />
        <StatDisplay
          label={top2.Type}
          value={top2.Value}
          accent="bg-slate-300"
        />
      </div>
      <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-5 py-3">
        <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
          Main Build
        </span>
        <span className="text-xs font-bold tracking-tight text-slate-200">
          {mainPassiveName}
        </span>
      </div>
    </Card>
  );
}

function SkillPointsCard({ usingSkillPoint, totalSkillPoint }: any) {
  const percentage = (Number(usingSkillPoint) / Number(totalSkillPoint)) * 100;
  return (
    <Card
      title="Skill Points"
      className="w-full"
      icon={<Zap size={16} className="text-amber-400" />}
    >
      <div className="flex flex-col justify-center p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
            Capacity
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-white">
              {usingSkillPoint}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              / {totalSkillPoint}
            </span>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function SkillListCard({ activeSkills, gemsData }: any) {
  const getSkillGems = (skillName: string) => {
    if (!gemsData?.Effects?.Skills) return [];
    const slots = gemsData.Effects.Skills.filter(
      (s: any) => s.Name === skillName
    ).map((s: any) => s.GemSlot);
    return gemsData.Gems?.filter((g: any) => slots.includes(g.Slot)) || [];
  };

  return (
    <Card
      title="Combat Skill Configuration"
      icon={<Swords size={18} className="text-slate-400" />}
      headerAction={
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400">
            {activeSkills.length} ACTIVE
          </span>
        </div>
      }
    >
      <div className="hidden grid-cols-12 border-b border-white/5 bg-white/[0.01] px-6 py-3 md:grid">
        <div className="col-span-3 text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
          Skill Identity
        </div>
        <div className="col-span-6 border-x border-white/5 text-center text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
          Tripod Matrix
        </div>
        <div className="col-span-3 text-right text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
          Runes & Gems
        </div>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {activeSkills.length > 0 ? (
          activeSkills.map((skill: any, idx: number) => (
            <SkillItem
              key={`${skill.Name}-${idx}`}
              skill={skill}
              gems={getSkillGems(skill.Name)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </Card>
  );
}

function StatDisplay({ label, value, accent, isMain }: any) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "h-1 w-1 rounded-full",
            accent,
            isMain && "shadow-[0_0_8px_#6366f1]"
          )}
        />
        <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
          {label}
        </span>
      </div>
      <span
        className={cn(
          "font-mono text-2xl font-black tracking-tighter",
          isMain ? "text-white" : "text-slate-400"
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
