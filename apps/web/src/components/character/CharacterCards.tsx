import { GRADE_TEXT_COLORS } from "@/constants/lostark/styles";
import { SectionHeader } from "./CharacterPage";
import { GRADE_POSITIONS } from "@/constants/lostark/option";

export function CharacterCards({ engravingsCard }: { engravingsCard: any }) {
  if (!engravingsCard?.Cards || engravingsCard.Cards.length === 0) {
    return (
      <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
        <SectionHeader title="카드" />
        <div className="p-4">
          <div className="py-8 text-center text-sm text-gray-400">
            장착된 카드가 없습니다
          </div>
        </div>
      </div>
    );
  }

  const activeCardSets = engravingsCard.Effects || [];

  return (
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/30 p-4">
        <h3 className="font-bold">카드</h3>
      </div>
      <div className="space-y-4 p-4">
        {activeCardSets.length > 0 && (
          <div className="space-y-2">
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
                  className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 p-2"
                >
                  <span className="text-sm font-semibold text-amber-300">
                    {setName}
                  </span>
                  <span className="text-sm font-bold text-amber-400">
                    {setAwakening}각성
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          {engravingsCard.Cards.map((card: any, cardIdx: number) => {
            const gradePos = GRADE_POSITIONS[card.Grade] || "0%";
            const textColor = GRADE_TEXT_COLORS[card.Grade] || "text-gray-400";
            const awakening = card.AwakeCount || 0;

            return (
              <div key={cardIdx} className="group relative w-full">
                <div className="relative aspect-248/362">
                  <div className="absolute inset-0 pt-[5.2%] pr-[4.2%] pl-[1.8%]">
                    {card.Icon ? (
                      <img
                        src={card.Icon}
                        alt={card.Name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-950">
                        <div className="text-xs text-gray-700">?</div>
                      </div>
                    )}
                  </div>

                  <div
                    className="absolute inset-0 aspect-248/362 bg-cover"
                    style={{
                      backgroundPosition: `${gradePos} 0`,
                      backgroundImage: `url(https://pica.korlark.com/2018/obt/assets/images/pc/profile/img_card_grade.png?f9e0ffc8a709611354db408dd0e7a7bb)`,
                    }}
                  />

                  <div className="absolute right-[7.5%] bottom-[6.5%] left-[5%] overflow-hidden">
                    <div
                      className="relative aspect-10/3 bg-cover drop-shadow-xl"
                      style={{
                        backgroundImage: `url(https://pica.korlark.com/2018/obt/assets/images/pc/profile/img_profile_awake.png)`,
                      }}
                    >
                      <div
                        className="absolute top-0 bottom-0 w-full bg-cover"
                        style={{
                          backgroundImage: `url(https://pica.korlark.com/2018/obt/assets/images/pc/profile/img_profile_awake.png)`,
                          backgroundPosition: `0 100%`,
                          left: `${-100 + (awakening / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p
                  className={`mt-1.5 -mb-2 w-full px-1 text-center text-xs font-medium break-keep ${textColor}`}
                >
                  {card.Name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
