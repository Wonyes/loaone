// components/character/CharacterCollectibleDetail.tsx
"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";
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
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 sm:p-6">
      {colData?.map((item: Collectible) => {
        const completedAreas = item.CollectiblePoints.filter(
          area => area.Point >= area.MaxPoint
        ).length;
        const totalAreas = item.CollectiblePoints.length;
        const progress = ((item.Point / item.MaxPoint) * 100).toFixed(1);

        return (
          <Card
            key={item.Type}
            onClick={() =>
              setOpenType(openType === item.Type ? null : item.Type)
            }
            icon={
              <span
                className="shrink-0"
                style={{
                  display: "inline-block",
                  backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_profile.png")`,
                  backgroundPosition: SPRITEPOSITIONS[item.Type] || "0 0",
                  width: "22px",
                  height: "22px",
                }}
              />
            }
            title={item.Type}
            className="relative cursor-pointer overflow-hidden"
            headerAction={
              <div className="relative flex items-center gap-3">
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-baseline gap-1.5 font-mono text-sm">
                    <span className="font-black text-emerald-400">
                      {item.Point}
                    </span>
                    <span className="text-gray-600">/</span>
                    <span className="font-bold text-gray-500">
                      {item.MaxPoint}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">
                    {progress}%
                  </span>
                </div>

                <ChevronDown
                  size={20}
                  className={cn(
                    "shrink-0 text-gray-500 transition-transform",
                    openType === item.Type && "rotate-180"
                  )}
                />
              </div>
            }
          >
            <div className="absolute top-2 left-[1.5rem] h-1.5 w-[calc(100%-3.6rem)] rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 via-teal-400/50 to-cyan-400/70 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            {openType === item.Type && (
              <div className="border-t border-white/5">
                <div className="grid grid-cols-1 gap-2 bg-white/[0.02] p-4 md:grid-cols-2 lg:grid-cols-3">
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
                          "flex items-center justify-between rounded-lg border p-2.5 transition-all",
                          isCompleted
                            ? "border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/20"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle2
                              size={16}
                              className="shrink-0 text-emerald-400"
                            />
                          ) : (
                            <Circle
                              size={16}
                              className="shrink-0 text-gray-500"
                            />
                          )}
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-xs font-bold",
                                isCompleted
                                  ? "text-emerald-300"
                                  : "text-gray-300"
                              )}
                            >
                              {area.PointName}
                            </span>
                            {!isCompleted && area.MaxPoint > 0 && (
                              <span className="text-[10px] text-gray-500">
                                {areaProgress}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span
                            className={cn(
                              "font-black",
                              isCompleted ? "text-emerald-400" : "text-white"
                            )}
                          >
                            {area.Point}
                          </span>
                          <span className="text-gray-600">/</span>
                          <span className="font-bold text-gray-500">
                            {area.MaxPoint}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] p-3 text-xs">
                  <span className="text-gray-400">
                    완료:{" "}
                    <span className="font-bold text-emerald-400">
                      {completedAreas}
                    </span>{" "}
                    / 미완료:{" "}
                    <span className="font-bold text-gray-300">
                      {totalAreas - completedAreas}
                    </span>
                  </span>
                  <span className="text-gray-400">
                    남은 개수:{" "}
                    <span className="font-bold text-orange-400">
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
  );
}
