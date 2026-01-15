"use client";

import {
  useCArkgirds,
  useCCards,
  useCCollectibles,
  useCEngravings,
  useCEquipment,
  useCGems,
} from "@/hooks/query/lostark/character/useLostarkApi";
import {
  Crown,
  Flame,
  Shield,
  Zap,
  LayoutGrid,
  BarChart3,
  ScrollText,
  Trophy,
  Sparkles,
} from "lucide-react";
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
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import {
  getLevelNumber,
  getQualityStyles,
  getTierNumber,
} from "@/utils/lostarkUtils";
import { cn } from "@/lib/utils";

export default function Equipment({
  name,
  topValues,
  profileData,
  arkpassiveData,
}: {
  name: string;
  topValues: any;
  profileData: any;
  arkpassiveData: any;
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

  const isLoading =
    isEquipmentLoading ||
    isGemsLoading ||
    isEngravingsLoading ||
    isCardsLoading ||
    isAkrgridLoading ||
    isCollectiblesLoading;

  if (isLoading) return <Loading />;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      {/* 1열: 장비 및 보석 */}
      <div className="space-y-4 xl:col-span-5">
        <EquipmentTab
          gemsData={gemsData}
          equipmentData={equipmentData}
          engravingsCard={engravingsCard}
        />
      </div>

      {/* 2열: 아크 시스템 */}
      <div className="space-y-4 xl:col-span-4">
        <ArkGridPanel arkgridData={arkgridData} />
        <ArkPassivePanel arkpassiveData={arkpassiveData} />
      </div>

      {/* 3열: 전투 스탯 및 수집형 */}
      <div className="xl:col-span-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2 xl:grid-cols-1 xl:gap-4">
          <div className="min-w-0">
            <StatsPanel stats={profileData?.Stats} topValues={topValues} />
          </div>

          <div className="min-w-0">
            <EngravingsPanel engravingsData={engravingsData} />
          </div>

          <div className="min-w-0">
            <CollectibleSummary collectiblesData={collectiblesData} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 아크 그리드 섹션 ---
function ArkGridPanel({ arkgridData }: { arkgridData: any }) {
  if (!arkgridData)
    return <EmptyCard title="아크 그리드" icon={<LayoutGrid size={18} />} />;

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

      if (element_000 === "코어 타입") coreType = element_001;
      else if (element_000 === "코어 공급 의지력") corePoint = element_001;
      else if (element_000 === "코어 옵션") coreOptions = element_001;
      else if (element_000 === "코어 옵션 발동 조건")
        coreCondition = element_001;
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
    <Card
      title="아크 그리드"
      icon={<LayoutGrid size={18} className="text-indigo-400" />}
    >
      <div className="grid grid-cols-2 gap-3 p-4">
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
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl border p-2.5 transition-all",
                  "border-white/10 bg-slate-800/40 hover:border-white/20 hover:bg-slate-800/60",
                  gradeStyle.border
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 p-0.5 shadow-lg",
                    gradeStyle.border,
                    gradeStyle.bg
                  )}
                >
                  <img
                    src={slot.Icon}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-[13px] font-black",
                      gradeStyle.text
                    )}
                  >
                    {slot.Name}
                  </p>
                  <p className="text-[10px] font-bold tracking-tighter text-gray-500 uppercase">
                    Core Fragment
                  </p>
                </div>

                <span className="absolute -top-2 -right-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-0.5 text-[10px] font-black text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                  {slot.Point}P
                </span>

                <div className="pointer-events-none absolute top-full left-0 z-[100] mt-3 hidden w-[340px] rounded-xl border border-white/10 bg-[#0c0d12]/98 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group-hover:block">
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <p
                        className={cn(
                          "text-base font-black italic",
                          gradeStyle.text
                        )}
                      >
                        {slot.Name}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        {coreType && (
                          <span className="text-xs font-bold text-gray-400">
                            {coreType}
                          </span>
                        )}
                        {corePoint && (
                          <span className="rounded border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-black text-purple-300">
                            {corePoint}
                          </span>
                        )}
                      </div>
                    </div>

                    {coreOptions && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-black tracking-widest text-emerald-400 uppercase">
                          ■ Core Options
                        </p>
                        <div className="space-y-2">
                          {coreOptions
                            .split(/(?=\[\d+P\])/)
                            .filter(part => part.trim())
                            .map((opt, i) => {
                              const match = opt.match(
                                /^\[(\d+P)\]\s*([\s\S]+)/
                              );
                              if (!match)
                                return (
                                  <div
                                    key={i}
                                    className="text-[12px] leading-relaxed text-gray-300"
                                  >
                                    {opt.trim()}
                                  </div>
                                );
                              const [, point, desc] = match;
                              return (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 rounded-lg bg-white/5 p-2"
                                >
                                  <span className="shrink-0 rounded bg-orange-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                                    {point}
                                  </span>
                                  <span className="text-[12px] leading-relaxed text-gray-200">
                                    {desc.trim()}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {coreCondition && coreCondition.trim() && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                        <p className="mb-1 text-[11px] font-black tracking-widest text-amber-400 uppercase">
                          ■ Activation
                        </p>
                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-gray-400">
                          {coreCondition}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            const effect = item.data;
            return (
              <div
                key={`effect-${idx}`}
                className="group relative flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/40 p-3 hover:bg-slate-800/60"
              >
                <span className="text-xs font-bold text-gray-300">
                  {effect.Name}
                </span>
                <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-black text-emerald-400">
                  Lv.{effect.Level}
                </span>

                {effect.Tooltip && (
                  <div className="pointer-events-none absolute top-full left-0 z-50 mt-2 hidden w-64 rounded-xl border border-white/10 bg-[#0c0d12]/95 p-3 shadow-2xl group-hover:block">
                    <p className="text-xs leading-relaxed text-gray-400">
                      {effect.Tooltip}
                    </p>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </Card>
  );
}

function ArkPassivePanel({ arkpassiveData }: { arkpassiveData: any }) {
  if (!arkpassiveData?.Effects)
    return <EmptyCard title="아크 패시브" icon={<Zap size={18} />} />;

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

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "진화":
        return {
          text: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: <Sparkles size={14} />,
        };
      case "깨달음":
        return {
          text: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          icon: <Zap size={14} />,
        };
      case "도약":
        return {
          text: "text-lime-400",
          bg: "bg-lime-500/10",
          border: "border-lime-500/20",
          icon: <Flame size={14} />,
        };
      default:
        return {
          text: "text-gray-400",
          bg: "bg-gray-500/10",
          border: "border-gray-500/20",
          icon: null,
        };
    }
  };

  return (
    <Card
      title="아크 패시브"
      icon={<Zap size={18} className="text-yellow-400" />}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {ARK_PAS.map(type => {
          const effects = groupedEffects[type] || [];
          const style = getTypeStyle(type);
          const pInfo = pointsMap[type];

          return (
            <div key={type} className="space-y-3">
              <div
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                  "border-white/10 bg-slate-800/40",
                  style.bg,
                  style.border
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-1 text-[11px] font-black tracking-widest uppercase",
                    style.text
                  )}
                >
                  {style.icon} {type}
                </div>
                <p className="mt-1 text-xl leading-none font-black text-white">
                  {pInfo?.Value || 0}
                </p>
                <p className="text-[10px] font-bold tracking-tighter text-gray-500 uppercase">
                  {pInfo?.Description || "Level 0"}
                </p>
              </div>

              <div className="space-y-1.5">
                {effects.map((eff: any, i: number) => {
                  const name =
                    eff.Description?.match(/티어\s+(.+?)\s+Lv\./)?.[1] ||
                    eff.Description;
                  const lv = eff.Description?.match(/Lv\.(\d+)/)?.[1] || 0;

                  return (
                    <div key={i} className="group relative">
                      <div
                        className={cn(
                          "flex cursor-help items-center gap-2 rounded-lg border p-2 transition-all",
                          "border-white/5 bg-slate-800/40 hover:border-white/20 hover:bg-slate-800/60"
                        )}
                      >
                        <img
                          src={eff.Icon}
                          className="h-7 w-7 rounded-md opacity-90 shadow-md"
                          alt=""
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "truncate text-[10px] leading-tight font-bold",
                              style.text
                            )}
                          >
                            {name}
                          </p>
                          <p className="text-[9px] font-black text-white/40 uppercase">
                            Lv.{lv}
                          </p>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute bottom-full left-0 z-[100] mb-2 hidden w-[280px] rounded-xl border border-white/10 bg-[#0c0d12]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:block">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                            <img src={eff.Icon} className="h-5 w-5" alt="" />
                            <p className={cn("text-xs font-black", style.text)}>
                              {name}
                            </p>
                            <span className="ml-auto text-[10px] font-bold text-gray-500">
                              Lv.{lv}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-gray-300">
                            {eff.Tooltip
                              ? JSON.parse(eff.Tooltip).Element_000.value
                              : eff.Description}
                          </p>
                        </div>
                        <div className="absolute top-full left-4 border-[6px] border-transparent border-t-[#0c0d12]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// --- 장비 탭 섹션 ---
function EquipmentTab({ equipmentData, gemsData, engravingsCard }: any) {
  const armorItems = equipmentData
    ? Object.values(equipmentData)
        .filter((i: any) => EQUIPMENT_ORDER.includes(i.Type))
        .sort(
          (a: any, b: any) =>
            EQUIPMENT_ORDER.indexOf(a.Type) - EQUIPMENT_ORDER.indexOf(b.Type)
        )
    : [];
  const accessoryItems = equipmentData
    ? Object.values(equipmentData).filter((i: any) =>
        EQUIPMENT_AEC.includes(i.Type)
      )
    : [];
  const stoneItems = equipmentData
    ? Object.values(equipmentData).filter(
        (i: any) => i.Type === "어빌리티 스톤"
      )
    : [];
  const braceletItems = equipmentData
    ? Object.values(equipmentData).filter((i: any) => i.Type === "팔찌")
    : [];

  return (
    <div className="space-y-4">
      <Card
        title="장비 및 장신구"
        icon={<Shield size={18} className="text-blue-400" />}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 xl:grid-cols-2">
          <div className="space-y-2">
            {armorItems.map((item: any, idx: number) => (
              <EquipmentCard key={idx} item={item} />
            ))}
          </div>
          <div className="space-y-2">
            {accessoryItems.map((item: any, idx: number) => (
              <AccessoryCard key={idx} item={item} />
            ))}
            {stoneItems.map((item: any, idx: number) => (
              <StoneCard key={idx} item={item} />
            ))}
          </div>
        </div>

        {braceletItems.map((item: any, idx: number) => (
          <div
            key={idx}
            className="border-t border-white/5 bg-white/[0.02] p-4"
          >
            <div className="flex gap-4">
              <div
                className={cn(
                  "h-12 w-12 shrink-0 rounded-xl p-0.5",
                  GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES]?.bg
                )}
              >
                <img
                  src={item.Icon}
                  className="h-full w-full rounded-lg"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Bracelet
                  </span>
                  <span
                    className={cn(
                      "text-xs font-black",
                      GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES]
                        ?.text
                    )}
                  >
                    {item.Name}
                  </span>
                </div>
                <CharacterBracelet item={item} />
              </div>
            </div>
          </div>
        ))}
      </Card>
      <div className="grid-auto-rows-fr grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 xl:grid-cols-1">
        <div className="min-w-0">
          <CharacterGems gemsData={gemsData} />
        </div>

        <div className="min-w-0">
          <CharacterCards engravingsCard={engravingsCard} />
        </div>
      </div>
    </div>
  );
}

// --- 장비 카드 상세 ---
function EquipmentCard({ item }: { item: any }) {
  const enhance = item.Name?.match(/\+(\d+)/)?.[1] || "";
  const grade =
    GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
  const qual = item.tooltip?.Element_001?.value?.qualityValue;
  const level = getLevelNumber(item.tooltip?.Element_001?.value?.leftStr2);

  let refinement = 0;
  const rawRefine = JSON.stringify(item.tooltip);
  const match = rawRefine.match(/\[상급 재련\]\s*(\d+)단계/);
  if (match) refinement = parseInt(match[1]);

  return (
    <div className="group flex h-[68px] items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-2 transition-all hover:border-white/20 hover:bg-slate-900/60">
      <div
        className={cn(
          "relative h-11 w-11 shrink-0 rounded-xl p-0.5",
          grade.bg,
          grade.border
        )}
      >
        <img src={item.Icon} className="h-full w-full rounded-lg" alt="" />
        <div className="absolute -top-1.5 -right-1 rounded bg-amber-600 px-1 text-[9px] font-black text-white shadow-lg">
          T{getTierNumber(item.tooltip?.Element_001?.value?.leftStr2)}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10px] leading-none font-bold text-gray-500 uppercase">
            {item.Type}
          </span>
          {qual > 0 && <Badge variant="quality" quality={qual} />}
          <Badge variant="level">{level}</Badge>
          {refinement > 0 && (
            <span className="rounded-md border border-purple-500/30 bg-purple-500/20 px-1.5 text-[10px] font-black text-purple-400">
              {refinement}단계
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 truncate">
          {enhance && (
            <span className={cn("text-sm font-black italic", grade.text)}>
              +{enhance}
            </span>
          )}
          <span className={cn("truncate text-xs font-bold", grade.text)}>
            {item.Name.replace(/\+\d+\s*/, "")}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 장신구 카드 상세 ---
function AccessoryCard({ item }: { item: any }) {
  const grade =
    GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
  const qual = item.tooltip?.Element_001?.value?.qualityValue;
  const stats = parseAccessoryOptions(item.tooltip);

  return (
    <div className="flex h-[68px] items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-2 hover:border-white/20">
      <div
        className={cn(
          "relative h-11 w-11 shrink-0 rounded-xl p-0.5",
          grade.bg,
          grade.border
        )}
      >
        <img src={item.Icon} className="h-full w-full rounded-lg" alt="" />
        <div className="absolute -top-1.5 -right-1 rounded bg-amber-600 px-1 text-[9px] font-black text-white shadow-lg">
          T{getTierNumber(item.tooltip?.Element_001?.value?.leftStr2)}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase">
            {item.Type}
          </span>
          {qual > 0 && (
            <span
              className={cn(
                "rounded px-1 text-[10px] font-black",
                getQualityStyles(qual)
              )}
            >
              {qual}
            </span>
          )}
        </div>
        <p className={cn("mb-1 truncate text-[11px] font-bold", grade.text)}>
          {item.Name}
        </p>
        <div className="flex gap-1">
          {stats.map((s, i) => (
            <span key={i} className={cn("text-[9px] font-bold", s.tierColor)}>
              {s.name} {s.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 어빌리티 스톤 카드 상세 ---
function StoneCard({ item }: { item: any }) {
  const grade =
    GRADE_STYLES[item.Grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
  const effectsObj =
    item.tooltip?.Element_007?.value?.Element_000?.contentStr || {};
  const inscriptions = Object.values(effectsObj)
    .map((e: any) => {
      const m = e.contentStr.match(/\[(.+?)\]\s*Lv\.(\d+)/);
      return m
        ? { name: m[1], level: m[2], isDebuff: m[1].includes("감소") }
        : null;
    })
    .filter(Boolean);

  return (
    <div className="flex h-[68px] items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-2 hover:border-white/20">
      <div
        className={cn("relative h-11 w-11 shrink-0 rounded-xl p-0.5", grade.bg)}
      >
        <img src={item.Icon} className="h-full w-full rounded-lg" alt="" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] leading-none font-bold text-gray-500 uppercase">
          Ability Stone
        </p>
        <div className="space-y-0.5">
          {inscriptions.map((ins: any, i: number) => (
            <div key={i} className="flex items-center gap-1.5 leading-none">
              <span
                className={cn(
                  "text-[10px] font-black",
                  ins.isDebuff ? "text-red-500" : "text-blue-400"
                )}
              >
                Lv.{ins.level}
              </span>
              <span className="truncate text-[10px] text-gray-300">
                {ins.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 전투 특성 섹션 ---
function StatsPanel({
  stats,
  topValues,
}: {
  stats: any[];
  topValues: number[];
}) {
  return (
    <Card
      title="전투 특성"
      icon={<BarChart3 size={18} className="text-emerald-400" />}
    >
      <div className="space-y-3 p-4">
        {stats?.map((stat: any, idx: number) => {
          const val = Number(stat.Value);
          const isMain = topValues.includes(val);
          const percentage = Math.min((val / 1800) * 100, 100);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isMain ? "text-white" : "text-gray-500"
                    )}
                  >
                    {stat.Type}
                  </span>
                  {val === topValues[2] && (
                    <Crown
                      size={14}
                      className="fill-emerald-400/20 text-emerald-400"
                    />
                  )}
                  {val === topValues[3] && (
                    <Flame
                      size={14}
                      className="fill-rose-400/20 text-rose-400"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "font-mono text-sm font-black",
                    isMain ? "text-white" : "text-gray-400"
                  )}
                >
                  {val.toLocaleString()}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/5">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    val === topValues[2]
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : val === topValues[3]
                        ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                        : "bg-gray-700"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// --- 각인 섹션 ---
function EngravingsPanel({ engravingsData }: { engravingsData: any }) {
  return (
    <Card
      title="각인"
      icon={<ScrollText size={18} className="text-cyan-400" />}
    >
      <div className="grid grid-cols-1 gap-2 p-4">
        {engravingsData?.ArkPassiveEffects.map((eng: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              <span className="text-sm font-black text-white">{eng.Name}</span>
            </div>
            <span className="text-xs font-black text-cyan-400">
              Level {eng.Level}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- 수집형 포인트 섹션 ---
function CollectibleSummary({ collectiblesData }: { collectiblesData: any }) {
  return (
    <Card
      title="수집형 포인트"
      icon={<Trophy size={18} className="text-amber-500" />}
    >
      <div className="grid grid-cols-1 gap-1 p-3">
        {collectiblesData?.map((col: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span
                className="shrink-0"
                style={{
                  backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_profile.png")`,
                  backgroundPosition: SPRITEPOSITIONS[col.Type] || "0 0",
                  width: "22px",
                  height: "22px",
                  transform: "scale(0.9)",
                }}
              />
              <span className="text-xs font-bold text-gray-400">
                {col.Type}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="font-black text-emerald-400">{col.Point}</span>
              <span className="text-gray-600">/</span>
              <span className="font-bold text-gray-500">{col.MaxPoint}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
