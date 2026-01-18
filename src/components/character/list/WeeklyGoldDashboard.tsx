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
          className="xs:px-4 xs:py-3.5 flex cursor-pointer items-center justify-between px-3 py-3 transition-colors hover:bg-white/[0.02] sm:px-6"
        >
          <div className="xs:gap-2 flex items-center gap-1.5 sm:gap-3">
            <div className="xs:h-6 xs:w-6 flex h-5 w-5 items-center justify-center rounded-lg bg-[#bef264]/10 sm:h-7 sm:w-7">
              <Coins size={12} className="xs:size-[14px] text-[#bef264]" />
            </div>
            <span className="xs:text-[11px] xs:tracking-[0.15em] text-[9px] font-black tracking-[0.1em] text-teal-500/60 uppercase sm:text-[14px] sm:tracking-[0.2em]">
              weekly gold
            </span>
          </div>

          <div className="xs:gap-3 flex items-center gap-2 sm:gap-8">
            <div className="xs:gap-0.5 flex flex-col items-end gap-0 sm:flex-row sm:items-baseline sm:gap-2.5">
              <span className="xs:inline hidden text-[9px] font-bold tracking-tighter text-slate-400 uppercase sm:text-[11px]">
                total
              </span>
              <span className="xs:text-lg font-mono text-base font-black tracking-tighter text-amber-400 tabular-nums sm:text-2xl">
                {grandTotal.toLocaleString()}{" "}
                <span className="xs:text-[10px] text-[9px] font-bold opacity-30 sm:text-xs">
                  G
                </span>
              </span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "xs:size-[18px] text-slate-600 transition-transform duration-500 sm:size-5",
                isOpen && "rotate-180 text-amber-400"
              )}
            />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="border-t border-white/5 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {processedData.map((char, idx) => (
                    <Card
                      key={idx}
                      className="group flex flex-col justify-between p-4 shadow-lg transition-all hover:border-[#bef264]/30 hover:bg-white/[0.01]"
                    >
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

                        {char.raids.length === 2 && (
                          <div className="h-[18px]" />
                        )}
                        {char.raids.length === 1 && (
                          <div className="h-[36px]" />
                        )}
                      </div>

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
