"use client";

import { GRADE_TEXT_COLORS, GRADE_STYLES } from "@/constants/lostark/styles";
import { GRADE_POSITIONS } from "@/constants/lostark/option";
import { Card } from "../../common/Card";
import { EmptyCard } from "../../common/NoItems";
import { Library, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGradeStyle } from "@/utils/lostarkUtils";

export function CharacterCards({ engravingsCard }: { engravingsCard: any }) {
  if (!engravingsCard?.Cards || engravingsCard.Cards.length === 0) {
    return <EmptyCard title="카드" icon={<Library size={18} />} />;
  }

  const activeCardSets = engravingsCard.Effects || [];

  return (
    <Card
      title="카드 세트 및 수집"
      icon={
        <Library size={18} className="flex h-full flex-col text-amber-400" />
      }
      className="h-full"
    >
      <div className="flex-1 space-y-6 p-5">
        {activeCardSets.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {activeCardSets.map((effect: any, idx: number) => {
              const activeIndex = effect.Index;
              const activeItem = effect.Items?.[activeIndex];
              if (!activeItem) return null;

              const setName = activeItem.Name.replace(/\s*\d+세트/, "").replace(
                /\s*\(\d+각성합계\)/,
                ""
              );

              const setCardSlots = effect.CardSlots || [];
              const setAwakening = setCardSlots.reduce(
                (sum: number, slotIndex: number) => {
                  const card = engravingsCard.Cards[slotIndex];
                  return sum + (card?.AwakeCount || 0);
                },
                0
              );

              return (
                <div
                  key={idx}
                  className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent p-2 transition-all hover:border-amber-500/40 hover:from-amber-500/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-500/20 p-0.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      <Sparkles size={14} className="text-amber-400" />
                    </div>
                    <span className="text-[13px] font-black tracking-tight whitespace-nowrap text-amber-100/90 transition-colors group-hover:text-white">
                      {setName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black whitespace-nowrap text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                      {setAwakening} 각성
                    </span>
                  </div>

                  <div className="absolute -right-4 -bottom-4 opacity-5 transition-opacity group-hover:opacity-10">
                    <Library size={60} className="text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {engravingsCard.Cards.map((card: any, cardIdx: number) => {
            const gradePos = GRADE_POSITIONS[card.Grade] || "0%";
            const textColor = GRADE_TEXT_COLORS[card.Grade] || "text-gray-400";
            const awakening = card.AwakeCount || 0;
            const gradeStyle = getGradeStyle(card.Grade);

            return (
              <div
                key={cardIdx}
                className="group relative flex flex-col items-center"
              >
                <div className="relative aspect-[248/362] w-full">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-lg opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40",
                      gradeStyle.bg
                    )}
                  />

                  <div className="absolute inset-0 z-10 pt-[5.2%] pr-[4.2%] pl-[1.8%]">
                    {card.Icon ? (
                      <img
                        src={card.Icon}
                        alt={card.Name}
                        className="h-full w-full rounded-[4px] object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-slate-900">
                        <span className="text-xs text-slate-700">?</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="absolute inset-0 z-20 aspect-[248/362] bg-cover"
                    style={{
                      backgroundPosition: `${gradePos} 0`,
                      backgroundImage: `url(https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_card_grade.png)`,
                    }}
                  />

                  <div className="absolute right-[7.5%] bottom-[6.5%] left-[5%] z-10 overflow-hidden">
                    <div className="relative aspect-[10/3] bg-cover drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
                      <div
                        className="absolute top-0 bottom-0 w-full bg-cover"
                        style={{
                          backgroundImage: `url(https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_profile_awake.png)`,
                          backgroundPosition: `0 100%`,
                          left: `${-100 + (awakening / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p
                  className={cn(
                    "mt-3 line-clamp-1 text-center text-[10px] leading-tight font-bold tracking-tighter transition-colors group-hover:text-white",
                    textColor
                  )}
                >
                  {card.Name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
