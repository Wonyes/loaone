"use client";

import { Card } from "../../common/Card";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";

export function CharacterGemsSidebar({ gemsData }: { gemsData: any }) {
  if (!gemsData?.Effects?.Skills) return null;

  const allSkills = gemsData.Effects.Skills.map((s: any) => ({
    ...s,
    level: gemsData.Gems?.find((g: any) => g.Slot === s.GemSlot)?.Level || 0,
    descriptions: s.Description || [],
  })).sort((a: any, b: any) => b.level - a.level);

  const damageGems = allSkills.filter(
    (s: any) => !s.descriptions[0]?.includes("재사용")
  );
  const cooldownGems = allSkills.filter((s: any) =>
    s.descriptions[0]?.includes("재사용")
  );

  return (
    <Card
      title="GEM CONFIGURATION"
      icon={<Gem size={14} className="text-[#bef264]" />}
      headerAction={
        <span className="font-mono text-[10px] font-black text-[#bef264]">
          {allSkills.length} SLOTS
        </span>
      }
    >
      <div className="flex min-h-[140px] flex-col divide-y divide-white/5 lg:flex-row lg:divide-x lg:divide-y-0">
        <div className="w-fit p-4">
          <div className="mb-3 flex items-center px-1">
            <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase">
              Damage / Support
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {damageGems.map((gem: any, i: number) => (
              <CompactGemItem key={i} gem={gem} variant="rose" />
            ))}
          </div>
        </div>

        <div className="w-fit p-4">
          <div className="mb-3 flex items-center px-1">
            <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">
              Cooldown
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {cooldownGems.map((gem: any, i: number) => (
              <CompactGemItem key={i} gem={gem} variant="blue" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CompactGemItem({
  gem,
  variant,
}: {
  gem: any;
  variant: "rose" | "blue";
}) {
  const isRose = variant === "rose";

  return (
    <div className="group flex items-center gap-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2 transition-all hover:border-white/10 hover:bg-white/[0.06]">
      <div className="relative shrink-0">
        <div className="h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-black shadow-inner">
          <img
            src={gem.Icon}
            alt=""
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <div
            className={cn(
              "absolute -right-0.5 -bottom-0.5 rounded-tl-md px-1 font-mono text-[9px] font-black text-white shadow-lg",
              isRose ? "bg-rose-600" : "bg-blue-600"
            )}
          >
            {gem.level}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="mb-0.5 truncate text-[11px] leading-tight font-bold text-slate-200 transition-colors group-hover:text-white">
          {gem.Name}
        </span>

        <div className="flex flex-col gap-0.5">
          {gem.descriptions.map((desc: string, idx: number) => {
            const valMatch = desc.match(/[\d.]+/);
            const value = valMatch ? `${valMatch[0]}%` : "0%";

            const label = desc.includes("피해")
              ? "피해"
              : desc.includes("지원")
                ? "지원"
                : "재감";

            return (
              <div key={idx} className="flex items-center gap-1.5 leading-none">
                <span
                  className={cn(
                    "text-[12px] font-black whitespace-nowrap",
                    isRose ? "text-rose-500" : "text-blue-400"
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-black tracking-tighter whitespace-nowrap",
                    isRose ? "text-rose-400/90" : "text-blue-300/90"
                  )}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
