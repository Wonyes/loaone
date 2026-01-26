"use client";

import { cn } from "@/lib/utils";
import { getGradeStyle } from "@/utils/lostarkUtils";
import { ChevronRight } from "lucide-react";

export function SkillItem({ gems, skill }: { gems: any[]; skill: any }) {
  const activeTripods =
    skill.Tripods?.filter((t: any) => t.IsSelected).sort(
      (a: any, b: any) => a.Tier - b.Tier
    ) || [];

  return (
    <div className="group grid grid-cols-1 items-center gap-4 px-4 py-4 transition-all hover:bg-white/[0.03] md:grid-cols-12 md:px-6 md:py-3">
      {/* Skill Identity */}
      <div className="col-span-1 md:col-span-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
            <img
              src={skill.Icon}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute right-0 bottom-0 rounded-tl-md bg-black/90 px-1 font-mono text-[9px] font-black text-indigo-400 sm:text-[10px]">
              {skill.Level}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-[13px] font-black tracking-tight text-slate-200 transition-colors group-hover:text-white sm:text-[14px]">
                {skill.Name}
              </h4>
              <GemAndRunes gems={gems} skill={skill} type="mobile" />
            </div>
            <span className="text-[8px] font-black tracking-tighter text-slate-400 uppercase sm:text-[9px]">
              Active Skill
            </span>
          </div>
        </div>
      </div>

      {/* Tripods */}
      <div
        className={cn(
          "col-span-1 flex items-center justify-between gap-1.5 md:col-span-6 md:gap-2 md:px-4",
          activeTripods.length === 0 && "hidden md:flex"
        )}
      >
        {[0, 1, 2].map(tierIndex => {
          const tp = activeTripods.find((t: any) => t.Tier === tierIndex);
          return (
            <div
              key={tierIndex}
              className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2"
            >
              {tp ? (
                <>
                  <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 bg-black/40 p-1.5 shadow-inner sm:h-8 sm:w-8">
                    <img
                      src={tp.Icon}
                      alt=""
                      className="h-full w-full object-contain opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <div className="min-w-0 flex-col leading-none sm:flex">
                    <span
                      className={cn(
                        "mr-1 truncate text-[11px] font-bold tracking-tighter sm:mr-0",
                        tp.Tier === 0
                          ? "text-blue-400"
                          : tp.Tier === 1
                            ? "text-emerald-400"
                            : "text-amber-400"
                      )}
                    >
                      {tp.Name}
                    </span>
                    <span className="font-mono text-[12px] font-bold text-slate-300">
                      Lv.{tp.Slot}
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-7 w-7 rounded-full border border-dashed border-white/5 opacity-20 sm:h-8 sm:w-8" />
              )}
            </div>
          );
        })}
      </div>

      <GemAndRunes gems={gems} skill={skill} type="desktop" />
    </div>
  );
}

function GemAndRunes({
  gems,
  skill,
  type,
}: {
  gems: any[];
  skill: any;
  type: "mobile" | "desktop";
}) {
  const runeStyle = skill.Rune ? getGradeStyle(skill.Rune.Grade) : null;

  if (type === "mobile") {
    return (
      <div className="flex items-center gap-1 md:hidden">
        {gems && gems.length > 0 && (
          <div className="flex items-center gap-1">
            {gems.map((gem: any, idx: number) => {
              const gemStyle = getGradeStyle(gem.Grade);
              return (
                <div
                  key={idx}
                  className={cn(
                    "relative h-7 w-7 rounded-lg border border-white/10 p-1 shadow-lg",
                    gemStyle.bg
                  )}
                  title={gem.Name}
                >
                  <img
                    src={gem.Icon}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/90 text-[8px] font-black text-white">
                    {gem.Level}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {skill.Rune && (
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-1.5 pr-1.5 pl-3 transition-colors hover:bg-white/5">
            <span className="text-[11px] font-bold tracking-tighter text-slate-300 uppercase">
              {skill.Rune.Name}
            </span>
            <div
              className={cn(
                "h-7 w-7 rounded-lg border border-white/10 p-1 shadow-2xl",
                runeStyle?.bg
              )}
            >
              <img
                src={skill.Rune.Icon}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="col-span-1 hidden items-center justify-end gap-2 md:col-span-3 md:flex">
      {/* Gems */}
      {gems && gems.length > 0 && (
        <div className="flex items-center gap-1">
          {gems.map((gem: any, idx: number) => {
            const gemStyle = getGradeStyle(gem.Grade);
            return (
              <div
                key={idx}
                className={cn(
                  "relative h-7 w-7 rounded-lg border border-white/10 p-1 shadow-lg",
                  gemStyle.bg
                )}
                title={gem.Name}
              >
                <img
                  src={gem.Icon}
                  alt=""
                  className="h-full w-full object-contain"
                />
                <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/90 text-[8px] font-black text-white">
                  {gem.Level}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rune */}
      {skill.Rune && (
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-1.5 pr-1.5 pl-3 transition-colors hover:bg-white/5">
          <span className="text-[11px] font-bold tracking-tighter text-slate-300 uppercase">
            {skill.Rune.Name}
          </span>
          <div
            className={cn(
              "h-7 w-7 rounded-lg border border-white/10 p-1 shadow-2xl",
              runeStyle?.bg
            )}
          >
            <img
              src={skill.Rune.Icon}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      <ChevronRight
        size={14}
        className="text-slate-800 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  );
}
