import {
  useCArkgirds,
  useCArkpassive,
  useCCards,
  useCCollectibles,
  useCEngravings,
  useCEquipment,
  useCGems,
} from "@/hooks/query/useLostarkApi";
import { Crown, Flame } from "lucide-react";
import { parseAccessoryOptions } from "@/utils/accessoryParser";
import Loading from "@/app/loading";
import { GRADE_STYLES } from "@/constants/lostark/styles";
import {
  ARK_PAS,
  EQUIPMENT_AEC,
  EQUIPMENT_ORDER,
  SPRITEPOSITIONS,
} from "@/constants/lostark/option";
import { EmptyCard } from "@/components/common/NoItems";

import { CharacterBracelet } from "@/components/character/equipment/CharacterBracelet";
import { CharacterGems } from "@/components/character/equipment/CharacterGems";
import { CharacterCards } from "@/components/character/equipment/CharacterCards";
import { ItemIcon } from "@/components/common/ItemIcon";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { StatRow } from "@/components/common/StatRow";
import {
  getLevelNumber,
  getQualityStyles,
  getTierNumber,
} from "@/utils/lostarkUtils";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function Equipment({
  name,
  topValues,
  profileData,
}: {
  name: string;
  topValues: any;
  profileData: any;
}) {
  const { data: equipmentData, isLoading: isEquipmentLoading } =
    useCEquipment(name);
  const { data: gemsData, isLoading: isGemsLoading } = useCGems(name);
  const { data: engravingsData, isLoading: isEngravingsLoading } =
    useCEngravings(name);
  const { data: engravingsCard, isLoading: isCardsLoading } = useCCards(name);
  const { data: collectiblesData, isLoading: isCollectiblesLoading } =
    useCCollectibles(name);

  const { data: arkgridData, isLoading: isAkrgridLoading } = useCArkgirds(name);
  const { data: arkpassiveData, isLoading: isAkrpassiveLoading } =
    useCArkpassive(name);

  const isLoading =
    isEquipmentLoading ||
    isGemsLoading ||
    isEngravingsLoading ||
    isCardsLoading ||
    isAkrgridLoading ||
    isAkrpassiveLoading ||
    isCollectiblesLoading;

  if (isLoading) return <Loading />;

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
      {/* 장비: 5/12 */}
      <div className="space-y-3 xl:col-span-5">
        <EquipmentTab
          gemsData={gemsData}
          equipmentData={equipmentData}
          engravingsData={engravingsData}
          engravingsCard={engravingsCard}
        />
      </div>

      {/* 아크: 4/12 */}
      <div className="space-y-3 xl:col-span-4">
        <ArkGridPanel arkgridData={arkgridData} />
        <ArkPassivePanel arkpassiveData={arkpassiveData} />
      </div>

      {/* 스탯: 3/12 */}
      <div className="space-y-3 xl:col-span-3">
        <StatsPanel stats={profileData?.Stats} topValues={topValues} />
        <EngravingsPanel engravingsData={engravingsData} />
        <CollectibleSummary collectiblesData={collectiblesData} />
      </div>
    </div>
  );
}

function ArkGridPanel({ arkgridData }: { arkgridData: any }) {
  if (!arkgridData) {
    return <EmptyCard title="아크 그리드" />;
  }

  const parseTooltip = (slot: any) => {
    let coreType = "";
    let corePoint = "";
    let coreOptions = "";
    let coreCondition = "";

    Object.keys(slot.tooltip || {}).forEach(key => {
      const element = slot.tooltip[key];
      if (!element?.value) return;

      const element_000 = element.value.Element_000;
      const element_001 = element.value.Element_001;

      if (!element_000 || !element_001) return;

      if (element_000 === "코어 타입") {
        coreType = element_001;
      } else if (element_000 === "코어 공급 의지력") {
        corePoint = element_001;
      } else if (element_000 === "코어 옵션") {
        coreOptions = element_001;
      } else if (element_000 === "코어 옵션 발동 조건") {
        coreCondition = element_001;
      }
    });

    return { coreType, corePoint, coreOptions, coreCondition };
  };

  const slots = arkgridData.Slots || [];
  const effects = arkgridData.Effects || [];
  const allItems = [
    ...slots.map((slot: any) => ({ type: "slot", data: slot })),
    ...effects.map((effect: any) => ({ type: "effect", data: effect })),
  ];

  return (
    <div className="design-card rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="아크 그리드" />

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {allItems.map((item, idx) => {
            if (item.type === "slot") {
              const slot = item.data;
              const gradeStyle =
                GRADE_STYLES[slot.Grade as keyof typeof GRADE_STYLES] ||
                GRADE_STYLES.전설;
              const { coreType, corePoint, coreOptions, coreCondition } =
                parseTooltip(slot);

              return (
                <div
                  key={`slot-${idx}`}
                  className={`group relative flex items-center gap-3 rounded-lg border bg-slate-800/30 p-2 transition-colors hover:bg-slate-800/50 ${gradeStyle.bg} ${gradeStyle.border}`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border}`}
                  >
                    <img
                      src={slot.Icon}
                      alt={slot.Name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[13px] font-semibold`}>
                      {slot.Name}
                    </p>
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg ring-2 ring-slate-900">
                    {slot.Point}P
                  </span>

                  <div className="pointer-events-none absolute top-full left-0 z-50 mt-2 hidden w-96 rounded-lg border border-gray-700 bg-gray-900/98 p-4 shadow-2xl group-hover:block">
                    <div className="space-y-3">
                      <div className="border-b border-gray-700 pb-2">
                        <p className={`text-base font-bold`}>{slot.Name}</p>
                        <div className="mt-1 flex items-center gap-3">
                          {coreType && (
                            <span className="text-xs text-gray-400">
                              {coreType}
                            </span>
                          )}
                          {corePoint && (
                            <span className="rounded bg-purple-500/30 px-2 py-0.5 text-xs font-semibold text-purple-300">
                              {corePoint}
                            </span>
                          )}
                        </div>
                      </div>

                      {coreOptions && (
                        <div className="space-y-1.5">
                          <p className="mb-2 text-xs font-bold text-emerald-400">
                            ■ 코어 옵션
                          </p>
                          <div className="space-y-1.5">
                            {(() => {
                              const parts = coreOptions.split(/(?=\[\d+P\])/);

                              return parts
                                .filter(part => part.trim())
                                .map((opt: string, i: number) => {
                                  const match = opt.match(
                                    /^\[(\d+P)\]\s*([\s\S]+)/
                                  );

                                  if (!match) {
                                    return (
                                      <div
                                        key={i}
                                        className="text-xs leading-relaxed text-gray-200"
                                      >
                                        {opt.trim()}
                                      </div>
                                    );
                                  }

                                  const [, point, desc] = match;

                                  return (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="flex-shrink-0 rounded bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white">
                                        {point}
                                      </span>
                                      <span className="text-xs leading-relaxed text-gray-200">
                                        {desc.trim()}
                                      </span>
                                    </div>
                                  );
                                });
                            })()}
                          </div>
                        </div>
                      )}

                      {coreCondition && coreCondition.trim() && (
                        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
                          <p className="mb-1.5 text-xs font-bold text-amber-400">
                            ■ 발동 조건
                          </p>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap text-gray-300">
                            {coreCondition}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // effect
              const effect = item.data;
              return (
                <div
                  key={`effect-${idx}`}
                  className="group relative rounded-lg border border-white/10 bg-slate-800/30 p-3 transition-colors hover:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-200">
                      {effect.Name}
                    </span>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-400">
                      Lv.{effect.Level}
                    </span>
                  </div>

                  {effect.Tooltip && (
                    <div className="pointer-events-none absolute top-full left-0 z-50 mt-2 hidden w-64 rounded-lg border border-gray-700 bg-gray-900/95 p-3 shadow-xl group-hover:block">
                      <p className="text-xs text-gray-300">{effect.Tooltip}</p>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

function ArkPassivePanel({ arkpassiveData }: { arkpassiveData: any }) {
  if (!arkpassiveData || !arkpassiveData.Effects) {
    return <EmptyCard title="아크 패시브" message="아크 패시브" />;
  }

  const groupedEffects = arkpassiveData.Effects.reduce(
    (acc: any, effect: any) => {
      const type = effect.Name || "기타";
      if (!acc[type]) acc[type] = [];
      acc[type].push(effect);
      return acc;
    },
    {}
  );

  const pointsMap = arkpassiveData.Points.reduce((acc: any, point: any) => {
    acc[point.Name] = point;
    return acc;
  }, {});

  const getTypeColor = (type: string) => {
    switch (type) {
      case "진화":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          badge: "bg-amber-500/20",
        };
      case "깨달음":
        return {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          text: "text-cyan-400",
          badge: "bg-cyan-500/20",
        };
      case "도약":
        return {
          bg: "bg-lime-500/10",
          border: "border-lime-500/20",
          text: "text-lime-400",
          badge: "bg-lime-500/20",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          border: "border-gray-500/20",
          text: "text-gray-400",
          badge: "bg-gray-500/20",
        };
    }
  };

  const getEffectName = (description: string) => {
    const match = description?.match(/티어\s+(.+?)\s+Lv\./);
    return match ? match[1] : description;
  };

  const getEffectLevel = (description: string) => {
    const match = description?.match(/Lv\.(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <div className="design-card rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="아크 패시브" />

      <div className="grid grid-cols-3 gap-4 p-4">
        {ARK_PAS.map(type => {
          const effects = groupedEffects[type] || [];
          const colors = getTypeColor(type);
          const pointInfo = pointsMap[type];

          return (
            <div key={type} className="space-y-2">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`rounded-md px-3 py-1 text-sm font-bold ${colors.badge} ${colors.text}`}
                >
                  {type}
                </span>
                <div className="flex flex-col">
                  <span className="text-xm font-bold text-gray-300">
                    {pointInfo?.Value || 0} 포인트
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {pointInfo?.Description}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {effects.map((effect: any, idx: number) => {
                  const effectName = getEffectName(effect.Description);
                  const effectLevel = getEffectLevel(effect.Description);

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 rounded-lg border p-2 ${colors.bg} ${colors.border}`}
                    >
                      {effect.Icon && (
                        <img
                          src={effect.Icon}
                          alt={effectName}
                          className="h-8 w-8 flex-shrink-0 rounded"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-xs font-semibold ${colors.text}`}
                        >
                          {effectName}
                        </p>
                        <p className={`text-[12px] font-bold ${colors.text}`}>
                          Lv.{effectLevel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EquipmentTab({ equipmentData, gemsData, engravingsCard }: any) {
  const armorItems = equipmentData
    ? Object.values(equipmentData)
        .filter((item: any) => EQUIPMENT_ORDER.includes(item.Type))
        .sort((a: any, b: any) => {
          return (
            EQUIPMENT_ORDER.indexOf(a.Type) - EQUIPMENT_ORDER.indexOf(b.Type)
          );
        })
    : [];

  const accessoryItems = equipmentData
    ? Object.values(equipmentData).filter((item: any) =>
        EQUIPMENT_AEC.includes(item.Type)
      )
    : [];

  const stoneItems = equipmentData
    ? Object.values(equipmentData).filter(
        (item: any) => item.Type === "어빌리티 스톤"
      )
    : [];

  const braceletItems = equipmentData?.filter(
    (item: any) => item.Type === "팔찌"
  );

  return (
    <>
      <Card title="장비">
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="space-y-1.5">
            {armorItems?.map((item: any, idx: number) => (
              <EquipmentCard key={idx} item={item} />
            ))}
          </div>

          <div className="space-y-1.5">
            {accessoryItems?.map((item: any, idx: number) => (
              <AccessoryCard key={idx} item={item} />
            ))}
            {stoneItems?.map((item: any, idx: number) => (
              <StoneCard key={idx} item={item} />
            ))}
          </div>
        </div>

        {braceletItems?.map((item: any, idx: number) => {
          const gradeStyle =
            GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] ||
            GRADE_STYLES.전설;

          return (
            <div key={idx} className="border-t border-white/10 p-3">
              <div className="flex gap-3">
                <div
                  className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border}`}
                >
                  <img
                    src={item.Icon}
                    className="h-full w-full object-cover"
                    alt={item.Name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-xs text-gray-400">{item.Type}</p>
                    <p
                      className={`hidden text-sm font-bold md:block ${gradeStyle.text}`}
                    >
                      {item.Name}
                    </p>
                  </div>
                  <CharacterBracelet item={item} />
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <CharacterGems gemsData={gemsData} />

      <CharacterCards engravingsCard={engravingsCard} />
    </>
  );
}

function EquipmentCard({ item }: { item: any }) {
  const enhanceLevel = item.Name?.match(/\+(\d+)/)?.[1] || "";
  const gradeStyle =
    GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
  const qualityValue = item.tooltip?.Element_001?.value?.qualityValue;
  const tierNumber = getTierNumber(item.tooltip?.Element_001?.value?.leftStr2);
  const levelNumber = getLevelNumber(
    item.tooltip?.Element_001?.value?.leftStr2
  );

  let refinementStep = 0;
  if (item.tooltip?.Element_005?.value) {
    const value = item.tooltip.Element_005.value;
    const text = typeof value === "string" ? value : JSON.stringify(value);
    const match = text.match(/\[상급 재련\]\s*(\d+)단계/);
    if (match) refinementStep = parseInt(match[1]);
  }

  return (
    <div className="design-card flex h-[64px] gap-2 rounded p-1.5 transition-colors hover:border-amber-500/30">
      <ItemIcon
        src={item.Icon}
        alt={item.Name}
        grade={item.Grade}
        tier={tierNumber}
        size="sm"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] text-gray-400">
            {item.Type === "투구" ? "머리" : item.Type}
          </p>
          {qualityValue > 0 && (
            <>
              <Badge variant="quality" quality={qualityValue} />
              <Badge variant="level">{levelNumber}</Badge>
            </>
          )}
        </div>

        {/* 모바일에서는 장비 이름 숨김 */}
        <p className="hidden truncate font-bold md:block">
          {enhanceLevel && (
            <span className={`text-[12px] ${gradeStyle.text}`}>
              +{enhanceLevel}
            </span>
          )}
          {refinementStep > 0 && (
            <Badge variant="purple" className="mx-1">
              {refinementStep}단계
            </Badge>
          )}
          <span className={`text-[12px] ${gradeStyle.text}`}>
            {item.Name?.replace(/\+\d+\s*/, "")}
          </span>
        </p>

        {/* 모바일에서는 강화 수치만 표시 */}
        <p className="truncate font-bold md:hidden">
          {enhanceLevel && (
            <span className={`text-[12px] ${gradeStyle.text}`}>
              +{enhanceLevel}
            </span>
          )}
          {refinementStep > 0 && (
            <Badge variant="purple" className="ml-1">
              {refinementStep}단계
            </Badge>
          )}
        </p>
      </div>
    </div>
  );
}

function AccessoryCard({ item }: { item: any }) {
  const gradeStyle =
    GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
  const qualityValue = item.tooltip?.Element_001?.value?.qualityValue;
  const qualityStyle = qualityValue ? getQualityStyles(qualityValue) : "";
  const accessoryStats = parseAccessoryOptions(item.tooltip);

  const leftStr2 = item.tooltip?.Element_001?.value?.leftStr2 || "";
  const tierNumber = getTierNumber(leftStr2);

  return (
    <div className="design-card flex h-[64px] gap-2 rounded p-1.5 transition-colors hover:border-amber-500/30">
      {/* 왼쪽: 아이콘 + 타입/품질/이름 */}
      <div className="flex min-w-0 flex-1 gap-1.5">
        <div
          className={`relative ${gradeStyle.bg} h-10 w-10 flex-shrink-0 overflow-hidden rounded border ${gradeStyle.border}`}
        >
          {item.Icon && (
            <img
              src={item.Icon}
              alt={item.Name}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded bg-amber-600/90 text-center text-[10px] leading-[14px] font-bold text-white">
            T{tierNumber}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          {/* 타입 + 품질: 넓을 때 가로, 좁을 때 세로 */}
          <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-1.5">
            <p className="text-[10px] text-gray-400">{item.Type}</p>
            {qualityValue > 0 && (
              <span
                className={`${qualityStyle} w-fit rounded px-1 py-0.5 text-[10px]`}
              >
                {qualityValue}
              </span>
            )}
          </div>

          {/* 이름: 768px 이상에서만 표시 */}
          <p
            className={`hidden truncate text-[12px] font-bold md:block ${gradeStyle.text}`}
          >
            {item.Name}
          </p>
        </div>
      </div>

      {/* 오른쪽: 옵션 (항상 세로 배치) */}
      {accessoryStats.length > 0 && (
        <div className="flex flex-shrink-0 flex-col items-end justify-center gap-0.5">
          {accessoryStats.map((stat, statIdx) => (
            <span
              key={statIdx}
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${stat.tierColor} bg-gray-800/50 whitespace-nowrap`}
            >
              {stat.tier} {stat.name} {stat.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StoneCard({ item }: { item: any }) {
  const gradeStyle =
    GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
  const effectsObj =
    item.tooltip?.Element_007?.value?.Element_000?.contentStr || {};
  const inscriptions = Object.values(effectsObj)
    .map((effect: any) => {
      const match = effect.contentStr.match(/\[(.+?)\]\s*Lv\.(\d+)/);
      if (!match) return null;
      return {
        name: match[1],
        level: parseInt(match[2]),
        isDebuff: match[1].includes("감소"),
      };
    })
    .filter(Boolean);
  const tierNumber = getTierNumber(item.tooltip?.Element_001?.value?.leftStr2);

  return (
    <div className="design-card flex h-[64px] gap-2 rounded p-1.5 transition-colors hover:border-amber-500/30">
      {/* 왼쪽: 아이콘 + 스톤/이름 */}
      <div className="flex flex-1 items-center gap-2">
        <div
          className={`relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border} p-0.5`}
        >
          <img
            src={item.Icon}
            className="h-full w-full rounded-sm object-cover"
            alt=""
          />
          <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded bg-amber-600/90 text-center text-[12px] leading-[14px] font-bold text-white">
            T{tierNumber}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[12px] font-bold tracking-wider text-gray-500 uppercase">
            스톤
          </p>

          {/* 768px 이상에서만 이름 표시 */}
          <p
            className={`hidden truncate text-[11px] font-bold md:block ${gradeStyle.text}`}
          >
            {item.Name}
          </p>
        </div>
      </div>

      {/* 오른쪽: 각인 (세로 배치) */}
      <div className="flex flex-col justify-center gap-0.5">
        {inscriptions.map((ins: any, iIdx: number) => (
          <div key={iIdx} className="flex items-center gap-1">
            <span
              className={`text-xs font-black ${ins.isDebuff ? "text-red-500" : "text-blue-400"}`}
            >
              Lv.{ins.level}
            </span>
            <span
              className={`text-xs ${ins.isDebuff ? "text-red-400" : "text-slate-300"}`}
            >
              {ins.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsPanel({
  stats,
  topValues,
}: {
  stats: any[];
  topValues: number[];
}) {
  return (
    <Card title="전투 특성">
      <div className="space-y-2 p-1">
        {stats?.map((stat: any, idx: number) => {
          const isTop3 = topValues[2] === Number(stat.Value);
          const isTop4 = topValues[3] === Number(stat.Value);
          const highlight = isTop3 ? "emerald" : isTop4 ? "violet" : "none";

          return (
            <StatRow
              key={idx}
              label={stat.Type}
              value={
                stat.Value >= 10000
                  ? Number(stat.Value).toLocaleString("ko-KR")
                  : stat.Value
              }
              highlight={highlight}
              icon={
                isTop3 ? (
                  <Crown className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                ) : isTop4 ? (
                  <Flame className="h-4 w-4 text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                ) : undefined
              }
            />
          );
        })}
      </div>
    </Card>
  );
}

function CollectibleSummary({ collectiblesData }: { collectiblesData: any }) {
  return (
    <Card title="수집형 포인트">
      <div className="space-y-2 p-3">
        {collectiblesData?.map((col: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg p-0 transition-colors hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block"
                style={{
                  backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_profile.png")`,
                  backgroundPosition: SPRITEPOSITIONS[col.Type] || "0 0",
                  width: "22px",
                  height: "22px",
                }}
              />
              <span className="font-medium text-gray-300">{col.Type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400">{col.Point}</span>
              <span className="text-gray-500">/</span>
              <span className="font-semibold text-gray-400">
                {col.MaxPoint}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EngravingsPanel({ engravingsData }: { engravingsData: any }) {
  return (
    <Card title="각인">
      <div className="space-y-2 p-3">
        {engravingsData?.ArkPassiveEffects.map((eng: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-2"
          >
            <span className="font-semibold text-emerald-300">{eng.Name}</span>
            <Badge variant="emerald">Lv.{eng.Level}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
