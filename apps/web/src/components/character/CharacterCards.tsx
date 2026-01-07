// components/CharacterCards.tsx
export function CharacterCards({ engravingsCard }: { engravingsCard: any }) {
  if (!engravingsCard?.Cards || engravingsCard.Cards.length === 0) {
    return (
      <div className="design-card rounded-lg border border-white/10 p-0">
        <div className="border-b border-white/10 p-3">
          <h3 className="font-bold">카드</h3>
        </div>
        <div className="p-4">
          <div className="py-8 text-center text-sm text-gray-400">
            장착된 카드가 없습니다
          </div>
        </div>
      </div>
    );
  }

  // 전체 각성 계산
  const totalAwakening = engravingsCard.Cards.reduce(
    (sum: number, card: any) => sum + (card.AwakeCount || 0),
    0
  );

  // 활성화된 세트 효과
  const activeCardSets = engravingsCard.Effects || [];

  return (
    <div className="design-card rounded-lg border border-white/10 p-0">
      <div className="flex items-center justify-between border-b border-white/10 p-3">
        <h3 className="font-bold">카드</h3>
        <span className="text-sm font-bold text-amber-400">
          {totalAwakening}각성
        </span>
      </div>
      <div className="space-y-4 p-4">
        {activeCardSets.length > 0 && (
          <div className="space-y-3">
            {activeCardSets.map((effect: any, idx: number) => {
              const setName = effect.Items?.[0]?.Name || "카드 세트";
              const setCount = effect.Items?.length || 0;

              return (
                <div
                  key={idx}
                  className="flex justify-between rounded-lg border border-gray-700/30 bg-gray-800/30 p-3"
                >
                  {/* 세트 헤더 */}
                  <span className="text-sm font-semibold text-amber-300">
                    {setName.replace(/\s*\(\d+각성합계\)/, "")}{" "}
                  </span>
                  <span className="text-xs text-gray-400">{setCount}세트</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {engravingsCard.Cards.map((card: any, cardIdx: number) => {
            const awakening = card.AwakeCount || 0;
            const awakeTotal = card.AwakeTotal || 5;

            return (
              <div key={cardIdx} className="group relative">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border-2 border-amber-600/40 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg transition-all hover:scale-105 hover:border-amber-500/60">
                  {card.Icon ? (
                    <img
                      src={card.Icon}
                      alt={card.Name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-xs text-gray-700">?</div>
                    </div>
                  )}

                  <div className="absolute bottom-0 w-full px-[10%] pb-[8%]">
                    <div className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      <div className="relative h-2.5 overflow-hidden rounded-full border border-gray-700/50 bg-gray-900/90">
                        <div className="absolute inset-0 flex items-center justify-between px-1">
                          {[...Array(awakeTotal)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-full w-1.5 rounded-full transition-all ${
                                i < awakening
                                  ? "bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 shadow-[0_0_6px_rgba(251,191,36,0.9)]"
                                  : "bg-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {awakening > 0 && (
                    <div className="absolute top-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-bold text-amber-300 shadow-lg">
                      {awakening}각
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
