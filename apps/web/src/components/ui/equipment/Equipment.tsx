import {
  useCArkgirds,
  useCArkpassive,
  useCCards,
  useCCollectibles,
  useCEngravings,
  useCEquipment,
  useCGems,
} from "@/hooks/query/useLostarkApi";
import { Crown, Flame, Gem, Sword } from "lucide-react";
import { parseAccessoryOptions } from "@/utils/accessoryParser";
import Loading from "@/app/loading";
import { GRADE_STYLES } from "@/constants/lostark/styles";
import {
  ARK_PAS,
  EQUIPMENT_AEC,
  EQUIPMENT_ORDER,
  SPRITEPOSITIONS,
  TABS,
} from "@/constants/lostark/option";
import { EmptyCard } from "@/components/common/NoItems";

import { CharacterBracelet } from "@/components/character/CharacterBracelet";
import { CharacterGems } from "@/components/character/CharacterGems";
import { CharacterCards } from "@/components/character/CharacterCards";
import { SectionHeader } from "@/components/character/CharacterPage";

export const getQualityStyles = (qualityValue: number) => {
  if (qualityValue === 100)
    return "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-sm";
  if (qualityValue >= 90)
    return "bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-sm";
  if (qualityValue >= 70)
    return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold shadow-sm";
  return "bg-gray-600/80 text-gray-200 font-medium";
};

export function getTierNumber(leftStr2: string): number | null {
  if (!leftStr2) return null;
  const match = leftStr2.match(/티어\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function getLevelNumber(leftStr2: string): number | null {
  if (!leftStr2) return null;
  const match = leftStr2.match(/레벨\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

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
    <>
      <div className="w-[700px] space-y-3">
        <EquipmentTab
          gemsData={gemsData}
          equipmentData={equipmentData}
          engravingsData={engravingsData}
          engravingsCard={engravingsCard}
        />
      </div>
      <div className="w-[550px] space-y-3">
        <ArkGridPanel arkgridData={arkgridData} />
        <ArkPassivePanel arkpassiveData={arkpassiveData} />
      </div>

      <div className="w-[330px] space-y-3">
        <StatsPanel stats={profileData?.Stats} topValues={topValues} />
        <EngravingsPanel engravingsData={engravingsData} />
        <CollectibleSummary collectiblesData={collectiblesData} />
      </div>
    </>
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

  return (
    <div className="design-card rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="아크 그리드" />

      <div className="flex gap-4 p-4">
        <div className="flex-1 space-y-2">
          <h4 className="mb-3 text-sm font-bold text-purple-300">장착 슬롯</h4>
          {arkgridData.Slots?.map((slot: any) => {
            const gradeStyle =
              GRADE_STYLES[slot.Grade as keyof typeof GRADE_STYLES] ||
              GRADE_STYLES.전설;
            const { coreType, corePoint, coreOptions, coreCondition } =
              parseTooltip(slot);

            return (
              <div
                key={slot.Index}
                className={`group relative flex items-center gap-3 rounded-lg border bg-slate-800/30 p-2 transition-colors hover:bg-slate-800/50 ${gradeStyle.bg} ${gradeStyle.border}`}
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border}`}
                >
                  <img
                    src={slot.Icon}
                    alt={slot.Name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold`}>{slot.Name}</p>
                </div>
                <span
                  className={`rounded-md bg-black/40 px-2 py-1 text-xs font-bold`}
                >
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
          })}
        </div>

        {arkgridData.Effects && arkgridData.Effects.length > 0 && (
          <div className="flex-1 space-y-2">
            <h4 className="mb-3 text-sm font-bold text-gray-300">활성 효과</h4>
            {arkgridData.Effects.map((effect: any, idx: number) => (
              <div
                key={idx}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-2">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer rounded px-5 py-1 text-base font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CharacterHeader({ profileData }: { profileData: any }) {
  return (
    <div className="design-card relative overflow-hidden rounded-xl bg-[#0b0f1a] bg-slate-900/50 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />

      {profileData?.CharacterImage && (
        <img
          src={profileData.CharacterImage}
          alt={profileData.CharacterName}
          className="pointer-events-none absolute top-[5px] left-1/2 h-[520px] w-[360px] -translate-x-1/2 scale-[1.3] [mask-image:linear-gradient(90deg,transparent,black_30%_80%,transparent)] [mask-image:linear-gradient(to_top,transparent_5%,black_55%)] object-cover object-[50%_15%] mix-blend-lighten drop-shadow-[0_0_80px_rgba(168,85,247,0.55)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_30%_80%,transparent)]"
        />
      )}

      <div className="relative z-10 flex min-h-[240px] items-end justify-between p-6">
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/20 p-2">
                <Gem className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xm text-gray-400">아이템 레벨</p>
                <p className="text-xl font-black text-emerald-400">
                  {profileData?.ItemAvgLevel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-500/20 p-2">
                <Sword className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xm text-gray-400">전투력</p>
                <p className="text-xl font-black text-violet-400">
                  {profileData?.CombatPower?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex gap-2">
              <span className="text-xm rounded-lg bg-slate-800/80 px-3 py-1.5 font-semibold text-gray-300">
                {profileData?.ServerName}
              </span>
              <span className="text-xm rounded-lg bg-slate-800/80 px-3 py-1.5 font-semibold text-gray-300">
                {profileData?.CharacterClassName}
              </span>
            </div>

            <h1 className="mb-3 text-4xl font-black tracking-tight">
              {profileData?.CharacterName}
            </h1>

            <div className="text-xm flex gap-6">
              <div>
                <span className="text-gray-400">전투 </span>
                <span className="font-bold text-white">
                  Lv.{profileData?.CharacterLevel}
                </span>
              </div>
              <div>
                <span className="text-gray-400">원정대 </span>
                <span className="font-bold text-white">
                  Lv.{profileData?.ExpeditionLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xm flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">길드</span>
            <span className="font-bold text-emerald-400">
              {profileData?.GuildName || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">영지</span>
            <span className="font-semibold text-white">
              {profileData?.TownName || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">명예</span>
            <span className="font-semibold text-white">
              {profileData?.HonorPoint || "-"}
            </span>
          </div>
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
                        <p className={`text-[10px] font-bold ${colors.text}`}>
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
      <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
        <SectionHeader title="장비" />

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

        {braceletItems?.map((item: any, idx: number) => (
          <div key={idx} className="border-t border-white/10 p-3">
            <div className="flex gap-3">
              <img src={item.Icon} className="h-12 w-12 rounded" alt="" />
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-xm text-gray-400">{item.Type}</p>
                  <p className="text-xm font-bold">{item.Name}</p>
                </div>
                <CharacterBracelet item={item} />
              </div>
            </div>
          </div>
        ))}
      </div>

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
  const qualityStyle = qualityValue ? getQualityStyles(qualityValue) : "";
  const tierNumber = getTierNumber(item.tooltip?.Element_001?.value?.leftStr2);
  const levelNumber = getLevelNumber(
    item.tooltip?.Element_001?.value?.leftStr2
  );

  let refinementStep = 0;

  if (item.tooltip?.Element_005?.value) {
    const value = item.tooltip.Element_005.value;
    const text = typeof value === "string" ? value : JSON.stringify(value);
    const match = text.match(/\[상급 재련\]\s*(\d+)단계/);
    if (match) {
      refinementStep = parseInt(match[1]);
    }
  }

  return (
    <div className="design-card flex h-[64px] gap-2 rounded p-1.5 transition-colors hover:border-amber-500/30">
      <div
        className={`relative ${gradeStyle.bg} h-11 w-11 flex-shrink-0 overflow-hidden rounded border ${gradeStyle.border}`}
      >
        {item.Icon && (
          <img
            src={item.Icon}
            alt={item.Name}
            className="h-full w-full object-cover"
          />
        )}
        {tierNumber !== null && (
          <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded bg-amber-600/90 text-center text-[12px] leading-[14px] font-bold text-white">
            T{tierNumber}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] text-gray-400">
            {item.Type === "투구" ? "머리" : item.Type}
          </p>
          {qualityValue > 0 && (
            <>
              <span
                className={`${qualityStyle} rounded px-1 py-0.5 text-[12px]`}
              >
                {qualityValue}
              </span>
              <span className={`rounded bg-gray-700 px-1 py-0.5 text-[12px]`}>
                {levelNumber}
              </span>
            </>
          )}
        </div>
        <p className="truncate text-[11px] font-bold">
          {enhanceLevel && (
            <span className={`text-xm ${gradeStyle.text} `}>
              +{enhanceLevel}
            </span>
          )}
          {refinementStep > 0 && (
            <span className="mr-1 ml-1 rounded bg-purple-500/20 px-1 py-0.5 text-[12px]">
              {refinementStep}단계
            </span>
          )}
          <span className={`text-xm ${gradeStyle.text}`}>
            {item.Name?.replace(/\+\d+\s*/, "")}
          </span>
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
    <div className="design-card flex h-[64px] gap-1.5 rounded p-1.5 transition-colors hover:border-amber-500/30">
      <div className="flex min-w-0 gap-1.5">
        <div
          className={`relative ${gradeStyle.bg} h-11 w-11 flex-shrink-0 overflow-hidden rounded border ${gradeStyle.border}`}
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
        <div className="min-w-[90] flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] text-gray-400">{item.Type}</p>
            {qualityValue > 0 && (
              <span
                className={`${qualityStyle} rounded px-1 py-0.5 text-[12px]`}
              >
                {qualityValue}
              </span>
            )}
          </div>
          <p className={`truncate text-[11px] font-bold ${gradeStyle.text}`}>
            {item.Name}
          </p>
        </div>
      </div>

      {accessoryStats.length > 0 && (
        <div className="flex flex-shrink-0 flex-col items-start justify-center gap-0.5">
          {accessoryStats.map((stat, statIdx) => (
            <span
              key={statIdx}
              className={`ml-3 rounded text-[12px] font-semibold ${stat.tierColor} bg-gray-800/50 whitespace-nowrap`}
            >
              [{stat.tier}] {stat.name} {stat.value}
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
    <div className="design-card flex h-[64px] gap-1.5 rounded p-1.5 transition-colors hover:border-amber-500/30">
      <div className="flex items-center gap-2">
        <div
          className={`relative h-11 w-11 flex-shrink-0 overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border} p-0.5`}
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
        <div className="min-w-[90] flex-1">
          <p className="mb-0.5 text-[12px] font-bold tracking-wider text-gray-500 uppercase">
            스톤
          </p>
          <p className={`truncate text-[11px] font-bold ${gradeStyle.text}`}>
            {item.Name}
          </p>
        </div>
      </div>

      <div className="ml-3 flex flex-col justify-center gap-0.5">
        {inscriptions.map((ins: any, iIdx: number) => (
          <div key={iIdx} className="flex items-center">
            <span
              className={`h-1.5 w-1.5 rounded-full ${ins.isDebuff ? "bg-red-500" : "bg-blue-400"}`}
            />
            <span
              className={`mr-1 ml-2 text-xs ${ins.isDebuff ? "text-red-400" : "text-slate-300"}`}
            >
              {ins.name}
            </span>
            <span
              className={`text-xs font-black ${ins.isDebuff ? "text-red-500" : "text-blue-400"}`}
            >
              Lv.{ins.level}
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
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="전투 특성" />

      <div className="space-y-2 p-1">
        {stats?.map((stat: any, idx: number) => {
          const isTop3 = topValues[2] === Number(stat.Value);
          const isTop4 = topValues[3] === Number(stat.Value);

          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-lg p-1.5 transition-colors ${
                isTop3
                  ? "bg-emerald-500/10"
                  : isTop4
                    ? "bg-violet-500/10"
                    : "hover:bg-slate-800/50"
              }`}
            >
              <span
                className={`font-medium ${
                  isTop3
                    ? "text-emerald-400"
                    : isTop4
                      ? "text-violet-400"
                      : "text-gray-300"
                }`}
              >
                {stat.Type}
              </span>
              <div className="flex items-center gap-2">
                {isTop3 && (
                  <Crown className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                )}
                {isTop4 && (
                  <Flame className="h-4 w-4 text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                )}
                <span
                  className={`font-bold ${
                    isTop3
                      ? "text-emerald-400"
                      : isTop4
                        ? "text-violet-400"
                        : "text-white"
                  }`}
                >
                  {stat.Value != null && Number(stat.Value) >= 10000
                    ? Number(stat.Value).toLocaleString("ko-KR")
                    : stat.Value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CollectibleSummary({ collectiblesData }: { collectiblesData: any }) {
  return (
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="수집형 포인트" />
      <div className="space-y-2 p-3">
        {collectiblesData &&
          collectiblesData?.map((col: any, idx: number) => (
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
    </div>
  );
}

function EngravingsPanel({ engravingsData }: { engravingsData: any }) {
  return (
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title="각인" />
      <div className="space-y-2 p-3">
        {engravingsData?.ArkPassiveEffects.map((eng: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-2"
          >
            <span className="font-semibold text-emerald-300">{eng.Name}</span>
            <span className="text-xm rounded-md bg-emerald-500/20 px-2.5 py-1 font-black text-emerald-400 shadow-sm">
              Lv.{eng.Level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
