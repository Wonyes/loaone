"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateWeeklyGold } from "@/constants/lostark/glod";
import { Card } from "@/components/common/Card";

export function WeeklyGoldDashboard({
  characters = [],
}: {
  characters: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 상위 6캐릭터 추출 및 골드 계산
  const processedData = useMemo(() => {
    if (!characters) return [];
    return [...characters]
      .sort(
        (a, b) =>
          parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
          parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
      )
      .slice(0, 6)
      .map(char => {
        const { myRaids, total } = calculateWeeklyGold(char.ItemAvgLevel);
        return { ...char, raids: myRaids, weeklyGold: total };
      });
  }, [characters]);

  const grandTotal = processedData.reduce((sum, c) => sum + c.weeklyGold, 0);

  return (
    <div className="mb-6 w-full px-1">
      <Card className="overflow-hidden border border-[#bef264]/10 shadow-2xl transition-all">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#bef264]/10">
              <Coins size={14} className="text-[#bef264]" />
            </div>
            <span className="text-[14px] font-black tracking-[0.2em] text-teal-500/60 uppercase">
              weekly gold
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[11px] font-bold tracking-tighter text-slate-400 uppercase">
                total gold
              </span>
              <span className="font-mono text-2xl font-black tracking-tighter text-amber-400 tabular-nums">
                {grandTotal.toLocaleString()}{" "}
                <span className="text-xs font-bold opacity-30">G</span>
              </span>
            </div>
            <ChevronDown
              size={20}
              className={cn(
                "text-slate-600 transition-transform duration-500",
                isOpen && "rotate-180 text-amber-400"
              )}
            />
          </div>
        </div>

        {/* [Content] 풀 데이터 리스트: 가로형 시트로 배치하여 가독성 확보 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="border-t border-white/5 p-4">
                {/* 💡 그리드 시스템 도입: 모바일 1열 / 태블릿 2열 / 데스크탑 3열 */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {processedData.map((char, idx) => (
                    <Card
                      key={idx}
                      className="group flex flex-col justify-between p-4 shadow-lg transition-all hover:border-[#bef264]/30 hover:bg-white/[0.01]"
                    >
                      {/* [상단] 캐릭터 기본 정보 & 총합 요약 */}
                      <div className="flex items-start justify-between border-b border-white/5 pb-3">
                        <div className="flex min-w-0 flex-col leading-tight">
                          <span className="truncate text-[14px] font-black tracking-tight text-slate-100 transition-colors group-hover:text-[#bef264]">
                            {char.CharacterName}
                          </span>
                          <div className="items-left mt-1 flex gap-2">
                            <span className="text-[12px] font-bold text-teal-500">
                              {char.CharacterClassName}
                            </span>
                            <span className="font-mono text-[12px] font-bold tracking-tighter text-slate-300 uppercase">
                              Lv.{char.ItemAvgLevel}
                            </span>
                          </div>
                        </div>

                        {/* 💰 캐릭터별 총합 (우측 상단 강조) */}
                        <div className="flex flex-col items-end">
                          <span className="mb-1 text-[10px] leading-none font-black tracking-widest text-slate-300 uppercase">
                            Total
                          </span>
                          <span className="font-mono text-[15px] leading-none font-black text-amber-400 tabular-nums">
                            {char.weeklyGold.toLocaleString()}
                            <span className="ml-0.5 text-[12px] font-bold text-white">
                              G
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* [하단] 레이드 상세 정보 (수직 리스트형) */}
                      <div className="mt-3 space-y-2 px-1">
                        {char.raids.map((raid: any, i: number) => (
                          <div
                            key={i}
                            className="group/raid flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-1 w-1 rounded-full bg-[#bef264]" />
                              <span className="text-[13px] font-bold tracking-tighter text-slate-300 uppercase transition-colors group-hover/raid:text-slate-200">
                                {raid.name}
                              </span>
                            </div>
                            <span className="font-mono text-[13px] font-black text-slate-300 tabular-nums">
                              {raid.gold.toLocaleString()}{" "}
                              <span className="text-[9px] font-bold uppercase">
                                G
                              </span>
                            </span>
                          </div>
                        ))}

                        {/* 만약 레이드가 3개 미만인 경우 높이 밸런스를 맞추기 위한 여백 (Optional) */}
                        {char.raids.length === 2 && (
                          <div className="h-[18px]" />
                        )}
                        {char.raids.length === 1 && (
                          <div className="h-[36px]" />
                        )}
                      </div>

                      {/* 하단 미세 포인트 선 */}
                      <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#bef264] to-transparent opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100" />
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
