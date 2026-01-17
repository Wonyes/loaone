"use client";

import {
  useArkgirds,
  useCards,
  useCollectibles,
  useEngravings,
  useEquipment,
  useGems,
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
} from "lucide-react";
import { parseAccessoryOptions } from "@/utils/accessoryParser";
import Loading from "@/app/loading";
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
  getRefinementLevel,
  parseStoneInscriptions,
  parseCoreTooltip,
  getArkPassiveStyle,
  getGradeStyle,
} from "@/utils/lostarkUtils";
import { cn } from "@/lib/utils";
import { ItemCard } from "./ItemCard";
import { HoverTooltip } from "@/components/common/HoverTooltip";
import { ArkPassiveIcon } from "./ArkPassiveIcon";

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
    useEquipment(name);
  const { data: gemsData, isLoading: isGemsLoading } = useGems(name);
  const { data: engravingsData, isLoading: isEngravingsLoading } =
    useEngravings(name);
  const { data: engravingsCard, isLoading: isCardsLoading } = useCards(name);
  const { data: collectiblesData, isLoading: isCollectiblesLoading } =
    useCollectibles(name);
  const { data: arkgridData, isLoading: isAkrgridLoading } = useArkgirds(name);

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
        {allItems.map((item, idx) =>
          item.type === "slot" ? (
            <ArkGridSlot key={`slot-${idx}`} slot={item.data} />
          ) : (
            <ArkGridEffect key={`effect-${idx}`} effect={item.data} />
          )
        )}
      </div>
    </Card>
  );
}

// 아크 그리드 슬롯 카드
function ArkGridSlot({ slot }: { slot: any }) {
  const gradeStyle = getGradeStyle(slot.Grade);
  const { coreType, corePoint, coreOptions, coreCondition } =
    parseCoreTooltip(slot);

  return (
    <HoverTooltip
      content={
        <ArkGridSlotTooltip
          slot={slot}
          gradeStyle={gradeStyle}
          coreType={coreType}
          corePoint={corePoint}
          coreOptions={coreOptions}
          coreCondition={coreCondition}
        />
      }
    >
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-xl border p-2.5 transition-all",
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
          <p className={cn("truncate text-[13px] font-black", gradeStyle.text)}>
            {slot.Name}
          </p>
          <p className="text-[10px] font-bold tracking-tighter text-gray-500 uppercase">
            Core Fragment
          </p>
        </div>

        <span className="absolute -top-2 -right-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-0.5 text-[10px] font-black text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]">
          {slot.Point}P
        </span>
      </div>
    </HoverTooltip>
  );
}

// 아크 그리드 슬롯 툴팁
function ArkGridSlotTooltip({
  slot,
  gradeStyle,
  coreType,
  corePoint,
  coreOptions,
  coreCondition,
}: any) {
  return (
    <div className="space-y-4">
      <div className="border-b border-white/10 pb-3">
        <p className={cn("text-base font-black italic", gradeStyle.text)}>
          {slot.Name}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          {coreType && (
            <span className="text-xs font-bold text-gray-400">{coreType}</span>
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
              .filter((part: string) => part.trim())
              .map((opt: string, i: number) => {
                const match = opt.match(/^\[(\d+P)\]\s*([\s\S]+)/);
                if (!match) {
                  return (
                    <div
                      key={i}
                      className="text-[12px] leading-relaxed text-gray-300"
                    >
                      {opt.trim()}
                    </div>
                  );
                }
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
  );
}

// 아크 그리드 효과 카드
function ArkGridEffect({ effect }: { effect: any }) {
  return (
    <HoverTooltip
      content={
        <p className="text-xs leading-relaxed text-gray-400">
          {effect.Tooltip}
        </p>
      }
      className="w-64"
    >
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/40 p-3 hover:bg-slate-800/60">
        <span className="text-xs font-bold text-gray-300">{effect.Name}</span>
        <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-black text-emerald-400">
          Lv.{effect.Level}
        </span>
      </div>
    </HoverTooltip>
  );
}

// --- 아크 패시브 섹션 ---
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

  return (
    <Card
      title="아크 패시브"
      icon={<Zap size={18} className="text-yellow-400" />}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {ARK_PAS.map(type => {
          const effects = groupedEffects[type] || [];
          const style = getArkPassiveStyle(type);
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
                  <ArkPassiveIcon type={style.iconType} size={11} />
                  {type}
                </div>
                <p className="mt-1 text-xl leading-none font-black text-white">
                  {pInfo?.Value || 0}
                </p>
                <p className="text-[10px] font-bold tracking-tighter text-gray-500 uppercase">
                  {pInfo?.Description || "Level 0"}
                </p>
              </div>

              <div className="space-y-1.5">
                {effects.map((eff: any, i: number) => (
                  <ArkPassiveEffect key={i} eff={eff} style={style} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// 아크 패시브 효과 카드
function ArkPassiveEffect({ eff, style }: { eff: any; style: any }) {
  const name =
    eff.Description?.match(/티어\s+(.+?)\s+Lv\./)?.[1] || eff.Description;
  const lv = eff.Description?.match(/Lv\.(\d+)/)?.[1] || 0;

  return (
    <HoverTooltip
      content={
        <ArkPassiveEffectTooltip eff={eff} name={name} lv={lv} style={style} />
      }
      className="w-[280px]"
      position="top"
    >
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
    </HoverTooltip>
  );
}

// 아크 패시브 효과 툴팁
function ArkPassiveEffectTooltip({
  eff,
  name,
  lv,
  style,
}: {
  eff: any;
  name: string;
  lv: string | number;
  style: any;
}) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <img src={eff.Icon} className="h-5 w-5" alt="" />
          <p className={cn("text-xs font-black", style.text)}>{name}</p>
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
    </>
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
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2 md:gap-2 xl:grid-cols-2">
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
                  getGradeStyle(item.Grade)?.bg
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
                      getGradeStyle(item.Grade)?.text
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

// --- 장비 카드 ---
function EquipmentCard({ item }: { item: any }) {
  const grade = getGradeStyle(item.Grade);
  const enhance = item.Name?.match(/\+(\d+)/)?.[1] || "";
  const qual = item.tooltip?.Element_001?.value?.qualityValue;
  const level = getLevelNumber(item.tooltip?.Element_001?.value?.leftStr2);
  const refinement = getRefinementLevel(item.tooltip);

  return (
    <ItemCard item={item}>
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
    </ItemCard>
  );
}

// --- 장신구 카드 ---
function AccessoryCard({ item }: { item: any }) {
  const grade = getGradeStyle(item.Grade);
  const qual = item.tooltip?.Element_001?.value?.qualityValue;
  const stats = parseAccessoryOptions(item.tooltip);

  return (
    <ItemCard item={item}>
      <div className="mb-0.5 flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase">
          {item.Type}
        </span>
        {qual > 0 && <Badge variant="quality" quality={qual} />}
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
    </ItemCard>
  );
}

// --- 어빌리티 스톤 카드 ---
function StoneCard({ item }: { item: any }) {
  const inscriptions = parseStoneInscriptions(item.tooltip);

  return (
    <ItemCard item={item} showTierBadge={false}>
      <p className="mb-1 text-[10px] leading-none font-bold text-gray-500 uppercase">
        Ability Stone
      </p>
      <div>
        {inscriptions.map((ins, i) => (
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
    </ItemCard>
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
  if (!stats) return null;

  return (
    <Card
      title="전투 특성"
      icon={<BarChart3 size={18} className="text-emerald-400" />}
    >
      <div className="space-y-3 p-4">
        {stats.map((stat: any, idx: number) => {
          const val = Number(stat.Value);
          const isMain = topValues.includes(val);
          const percentage = Math.min((val / 1800) * 100, 100);
          const isTop1 = val === topValues[2];
          const isTop2 = val === topValues[3];

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
                  {isTop1 && (
                    <Crown
                      size={14}
                      className="fill-emerald-400/20 text-emerald-400"
                    />
                  )}
                  {isTop2 && (
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
                    isTop1
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : isTop2
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
  if (!engravingsData?.ArkPassiveEffects) return null;

  return (
    <Card
      title="각인"
      icon={<ScrollText size={18} className="text-cyan-400" />}
    >
      <div className="grid grid-cols-1 gap-2 p-4">
        {engravingsData.ArkPassiveEffects.map((eng: any, idx: number) => (
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
  if (!collectiblesData) return null;

  return (
    <Card
      title="수집형 포인트"
      icon={<Trophy size={18} className="text-amber-500" />}
    >
      <div className="grid grid-cols-1 gap-1 p-3">
        {collectiblesData.map((col: any, idx: number) => (
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
