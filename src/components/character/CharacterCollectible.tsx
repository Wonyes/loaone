"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle, Trophy } from "lucide-react";
import { Card } from "../common/Card";
import { cn } from "@/lib/utils";
import { useCollectibles } from "@/hooks/query/lostark/character/useLostarkApi";
import { SPRITEPOSITIONS } from "@/constants/lostark/option";
import { CharacterCollectibleSkeleton } from "../common/CardSkeleton";

interface CollectiblePoint {
  PointName: string;
  Point: number;
  MaxPoint: number;
}

interface Collectible {
  Type: string;
  Point: number;
  MaxPoint: number;
  Icon: string;
  CollectiblePoints: CollectiblePoint[];
}

export function CharacterCollectible({ name }: { name: string }) {
  const { data: colData, isLoading } = useCollectibles(name);
  const [openType, setOpenType] = useState<string | null>(null);

  if (isLoading) return <CharacterCollectibleSkeleton />;
  if (!colData) return null;

  const totalPoints = colData.reduce((acc, item) => acc + item.Point, 0);
  const totalMaxPoints = colData.reduce((acc, item) => acc + item.MaxPoint, 0);
  const totalProgress = ((totalPoints / totalMaxPoints) * 100).toFixed(1);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <TotalProgressWidget totalProgress={Number(totalProgress)} />

      <div className="flex flex-col gap-3">
        {colData?.map((item: Collectible) => {
          const completedAreas = item.CollectiblePoints.filter(
            area => area.Point >= area.MaxPoint
          ).length;
          const totalAreas = item.CollectiblePoints.length;
          const progress = ((item.Point / item.MaxPoint) * 100).toFixed(1);

          return (
            <Card
              borderB={false}
              key={item.Type}
              onClick={() =>
                setOpenType(openType === item.Type ? null : item.Type)
              }
              icon={
                <div className="relative rounded-lg border border-white/5 bg-white/5 p-1">
                  <span
                    className="block shrink-0"
                    style={{
                      backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_profile.png")`,
                      backgroundPosition: SPRITEPOSITIONS[item.Type] || "0 0",
                      width: "22px",
                      height: "22px",
                      filter:
                        Number(progress) === 100
                          ? "none"
                          : "grayscale(0.5) opacity(0.8)",
                    }}
                  />
                </div>
              }
              title={item.Type}
              className={cn(
                "relative cursor-pointer transition-all duration-300",
                openType === item.Type
                  ? "bg-white/[0.04] ring-1 ring-[#bef264]/20"
                  : "hover:bg-white/[0.03]"
              )}
              headerAction={
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1 font-mono text-sm">
                      <span className="font-black text-[#bef264]">
                        {item.Point}
                      </span>
                      <span className="text-xs text-slate-400">/</span>
                      <span className="font-bold text-slate-300">
                        {item.MaxPoint}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 w-20 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full bg-[#bef264] shadow-[0_0_8px_rgba(190,242,100,0.5)] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-slate-300 transition-transform duration-300",
                      openType === item.Type && "rotate-180 text-white"
                    )}
                  />
                </div>
              }
            >
              {openType === item.Type && (
                <div className="animate-in fade-in slide-in-from-top-1 border-t border-white/5 bg-[#0a0b10]/30 duration-300">
                  <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {item.CollectiblePoints.map(area => {
                      const isCompleted = area.Point >= area.MaxPoint;
                      const areaProgress =
                        area.MaxPoint > 0
                          ? ((area.Point / area.MaxPoint) * 100).toFixed(0)
                          : 0;

                      return (
                        <div
                          key={area.PointName}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-3 transition-all",
                            isCompleted
                              ? "border-[#bef264]/20 bg-[#bef264]/5"
                              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            {isCompleted ? (
                              <CheckCircle2
                                size={14}
                                className="shrink-0 text-[#bef264]"
                              />
                            ) : (
                              <Circle
                                size={14}
                                className="shrink-0 text-slate-400"
                              />
                            )}
                            <div className="flex flex-col truncate">
                              <span
                                className={cn(
                                  "truncate text-[11px] font-bold",
                                  isCompleted
                                    ? "text-[#bef264]"
                                    : "text-slate-300"
                                )}
                              >
                                {area.PointName}
                              </span>
                              {!isCompleted && Number(areaProgress) > 0 && (
                                <span className="text-[9px] font-bold text-slate-300">
                                  {areaProgress}%
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="ml-2 flex items-center gap-1 font-mono text-[10px]">
                            <span
                              className={cn(
                                "font-black",
                                isCompleted
                                  ? "text-[#bef264]"
                                  : "text-slate-400"
                              )}
                            >
                              {area.Point}
                            </span>
                            <span className="text-slate-700">/</span>
                            <span className="text-slate-300">
                              {area.MaxPoint}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.01] px-5 py-3 text-[11px] font-medium">
                    <div className="flex gap-4 text-slate-300">
                      <span>
                        완료
                        <span className="ml-1 font-bold text-[#bef264]">
                          {completedAreas}
                        </span>
                      </span>
                      <span>
                        미완료
                        <span className="ml-1 font-bold text-slate-300">
                          {totalAreas - completedAreas}
                        </span>
                      </span>
                    </div>
                    <span className="text-slate-300">
                      남은 개수
                      <span className="ml-1 font-bold text-orange-400">
                        {item.MaxPoint - item.Point}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// 상단 진행도 위젯 컴포넌트
function TotalProgressWidget({ totalProgress }: { totalProgress: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (totalProgress / 100) * circumference;

  return (
    <Card
      title="Total Collectible"
      borderB={false}
      headerAction={
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <div className="absolute inset-0 z-10 mb-0.5 flex items-center justify-center">
            <div className="flex items-baseline leading-none">
              <span className="font-mono text-sm font-black tracking-tighter text-white">
                {Math.floor(totalProgress)}
              </span>
              <span className="ml-0.5 text-[8px] font-bold text-[#bef264]">
                %
              </span>
            </div>
          </div>

          <svg className="h-full w-full -rotate-90 transform overflow-visible">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset: offset,
                filter: "drop-shadow(0 0 3px rgba(190, 242, 100, 0.4))",
              }}
              strokeLinecap="round"
              className="text-[#bef264] transition-all duration-1000 ease-in-out"
            />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Trophy
              size={24}
              className="text-[#bef264] opacity-[0.03] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.08]"
            />
          </div>
        </div>
      }
      className="w-full shadow-2xl transition-all hover:border-[#bef264]/20 hover:bg-[#041d1d]/70"
    />
  );
}
