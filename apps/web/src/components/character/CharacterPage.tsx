"use client";

import {
  useCCards,
  useCCollectibles,
  useCEngravings,
  useCEquipment,
  useCGems,
  useCProfile,
  useCSkills,
} from "@/hooks/query/useLostarkApi";
import { Crown, Flame, Gem, Sword } from "lucide-react";
import { useState } from "react";
import { CharacterBracelet } from "./CharacterBracelet";
import { CharacterGems } from "./CharacterGems";
import { CharacterCards } from "./CharacterCards";
import { parseAccessoryOptions } from "@/utils/accessoryParser";

// 등급 스타일 상수
const GRADE_STYLES = {
  고대: {
    bg: "bg-gradient-to-br from-[#3d3325] to-[#dcc999]",
    text: "text-[#dcc999]",
    border: "border-[#dcc999]/40",
  },
  유물: {
    bg: "bg-gradient-to-br from-[#341a09] to-[#a24006]",
    text: "text-[#a24006]",
    border: "border-[#a24006]/40",
  },
  전설: {
    bg: "bg-gradient-to-br from-[#362003] to-[#9e5f04]",
    text: "text-[#9e5f04]",
    border: "border-[#9e5f04]/40",
  },
} as const;

// 품질 스타일 함수
const getQualityStyles = (qualityValue: number) => {
  if (qualityValue === 100)
    return "bg-gradient-to-br from-[#3d3325] to-[#dcc999]";
  if (qualityValue >= 90)
    return "bg-gradient-to-br from-[#2d1a3d] to-[#8b5cf6]";
  if (qualityValue >= 80)
    return "bg-gradient-to-br from-[#1a2d3d] to-[#2ab1f6]";
  return "bg-gray-600";
};

// 티어 번호 추출 함수
const getTierNumber = (leftStr2?: string) => {
  return leftStr2?.match(/티어\s*(\d+)/)?.[1] || "4";
};

// 탭 설정
const TABS = [
  { id: "equipment", label: "장비" },
  { id: "avatar", label: "아바타" },
  { id: "skill", label: "스킬" },
  { id: "history", label: "히스토리" },
  { id: "collectible", label: "수집형 포인트" },
  { id: "characters", label: "보유 캐릭터" },
  { id: "guild", label: "길드" },
] as const;

// 수집형 포인트 데이터
const COLLECTIBLES = [
  { name: "모코코 씨앗", value: "1234", max: "1485", icon: "🌿" },
  { name: "섬의 마음", value: "14", max: "30", icon: "💚" },
  { name: "거인의 심장", value: "10", max: "15", icon: "❤️" },
  { name: "오르페우스의 별", value: "10", max: "10", icon: "⭐" },
  { name: "위대한 미술품", value: "8", max: "9", icon: "🎨" },
  { name: "세계수의 잎", value: "7", max: "7", icon: "🍃" },
];

const COLLECTIBLES_SUMMARY = COLLECTIBLES.slice(0, 4);

// 장비 정렬 순서
const EQUIPMENT_ORDER = ["투구", "어깨", "상의", "하의", "장갑", "무기"];

export default function CharacterPage({ name }: { name: string }) {
  const [activeTab, setActiveTab] = useState("equipment");

  const { data: profileData } = useCProfile(name);
  const { data: equipmentData } = useCEquipment(name);
  const { data: gemsData } = useCGems(name);
  const { data: engravingsData } = useCEngravings(name);
  const { data: engravingsCard } = useCCards(name);
  const { data: skillsData } = useCSkills(name);
  const { data: collectiblesData } = useCCollectibles(name);

  const topValues = [...(profileData?.Stats || [])]
    .map(s => Number(s.Value))
    .sort((a, b) => b - a)
    .slice(0, 4);

  return (
    <div className="mx-auto mt-6 flex flex-col gap-2">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <CharacterHeader profileData={profileData} />

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="space-y-2">
          {activeTab === "equipment" && (
            <EquipmentTab
              equipmentData={equipmentData}
              gemsData={gemsData}
              engravingsData={engravingsData}
            />
          )}
          {activeTab === "avatar" && <PlaceholderTab text="아바타 정보" />}
          {activeTab === "skill" && <PlaceholderTab text="스킬 정보" />}
          {activeTab === "history" && <PlaceholderTab text="히스토리 정보" />}
          {activeTab === "collectible" && <CollectibleTab />}
          {activeTab === "characters" && (
            <PlaceholderTab text="보유 캐릭터 정보" />
          )}
          {activeTab === "guild" && <PlaceholderTab text="길드 정보" />}
        </div>

        <div className="w-full flex-1 space-y-3 lg:w-80 lg:flex-shrink-0">
          <div className="design-card rounded-lg border border-white/10 p-0">
            <div className="border-b border-white/10 p-3">
              <h3 className="font-bold">각인</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 p-3">
              {engravingsData?.ArkPassiveEffects.map(
                (eng: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/5 p-2"
                  >
                    <span className="font-bold">{eng.Name}</span>
                    <span className="font-bold text-emerald-400">
                      Lv.{eng.Level}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <CharacterCards engravingsCard={engravingsCard} />
          <CollectibleSummary />
        </div>
        <div className="w-full flex-1 space-y-3 lg:w-80 lg:flex-shrink-0">
          <StatsPanel stats={profileData?.Stats} topValues={topValues} />
          <CharacterCards engravingsCard={engravingsCard} />
          <CollectibleSummary />
        </div>
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
    <div className="design-card rounded-lg border border-white/10 p-2">
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
    <div className="design-card relative overflow-hidden rounded-2xl bg-[#0b0f1a]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      {profileData?.CharacterImage && (
        <img
          src={profileData.CharacterImage}
          alt={profileData.CharacterName}
          className="pointer-events-none absolute top-[5px] left-1/2 h-[520px] w-[360px] -translate-x-1/2 scale-[1.3] [mask-image:linear-gradient(90deg,transparent,black_30%_80%,transparent)] [mask-image:linear-gradient(to_top,transparent_5%,black_55%)] object-cover object-[50%_15%] mix-blend-lighten drop-shadow-[0_0_80px_rgba(168,85,247,0.55)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_30%_80%,transparent)]"
        />
      )}

      <div className="relative z-10 flex max-h-[240px] min-h-[200px] items-end justify-between p-2">
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Gem className="h-6 w-6 text-emerald-400" />
              <p className="text-2xl font-extrabold text-emerald-400">
                {profileData?.ItemAvgLevel}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Sword className="h-6 w-6 text-violet-400" />
              <p className="text-2xl font-extrabold">
                {profileData?.CombatPower}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="rounded bg-black/60 px-2 py-0.5 text-gray-300">
                  {profileData?.ServerName}
                </span>
                <span className="rounded bg-black/60 px-2 py-0.5 text-gray-300">
                  {profileData?.CharacterClassName}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {profileData?.CharacterName}
              </h1>
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
              <span className="col-span-2 text-gray-400">전투</span>
              <span className="col-span-2 font-bold">
                Lv.{profileData?.CharacterLevel}
              </span>
              <span className="col-span-2 text-gray-400">원정대</span>
              <span className="col-span-2 font-bold">
                Lv.{profileData?.ExpeditionLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <div className="w-9 text-gray-400">길드</div>
            <div className="font-bold text-emerald-400">
              {profileData?.GuildName || "-"}
            </div>
            <div className="text-gray-400">영지</div>
            <div className="font-bold">{profileData?.TownName || "-"}</div>
            <div className="text-gray-400">명예</div>
            <div className="font-bold">{profileData?.HonorPoint || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EquipmentTab({ equipmentData, gemsData, engravingsData }: any) {
  const armorItems = equipmentData
    ?.filter((item: any) =>
      ["무기", "투구", "상의", "하의", "장갑", "어깨"].includes(item.Type)
    )
    .sort((a: any, b: any) => {
      return EQUIPMENT_ORDER.indexOf(a.Type) - EQUIPMENT_ORDER.indexOf(b.Type);
    });

  const accessoryItems = equipmentData?.filter((item: any) =>
    ["목걸이", "귀걸이", "반지"].includes(item.Type)
  );

  const stoneItems = equipmentData?.filter(
    (item: any) => item.Type === "어빌리티 스톤"
  );
  const braceletItems = equipmentData?.filter(
    (item: any) => item.Type === "팔찌"
  );

  return (
    <>
      <div className="design-card rounded-lg border border-white/10 p-0">
        <div className="border-b border-white/10 p-3">
          <h3 className="text-base font-bold">장비</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 p-2">
          {/* 왼쪽: 방어구 */}
          <div className="space-y-1.5">
            {armorItems?.map((item: any, idx: number) => (
              <EquipmentCard key={idx} item={item} />
            ))}
          </div>

          {/* 오른쪽: 악세서리 + 스톤 */}
          <div className="space-y-1.5">
            {accessoryItems?.map((item: any, idx: number) => (
              <AccessoryCard key={idx} item={item} />
            ))}
            {stoneItems?.map((item: any, idx: number) => (
              <StoneCard key={idx} item={item} />
            ))}
          </div>
        </div>

        {/* 팔찌 */}
        {braceletItems?.map((item: any, idx: number) => (
          <div key={idx} className="border-t border-white/10 p-3">
            <div className="flex gap-3">
              <img src={item.Icon} className="h-12 w-12 rounded" alt="" />
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm text-gray-400">{item.Type}</p>
                  <p className="text-sm font-bold">{item.Name}</p>
                </div>
                <CharacterBracelet item={item} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CharacterGems gemsData={gemsData} />
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

  return (
    <div className="design-card flex h-[60px] gap-2 rounded border border-white/5 p-1.5 transition-colors hover:border-amber-500/30">
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
        <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded bg-amber-600/90 text-center text-[12px] leading-[14px] font-bold text-white">
          T{tierNumber}
        </div>
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
              <span className="rounded bg-purple-500/20 px-1 py-0.5 text-[12px]">
                {item.tooltip.Element_005.value.match(/\d+/)[0]}단계
              </span>
            </>
          )}
        </div>
        <p className="truncate text-[11px] font-bold">
          {enhanceLevel && (
            <span className={`text-sm ${gradeStyle.text} mr-1.5`}>
              +{enhanceLevel}
            </span>
          )}
          <span className={`text-sm ${gradeStyle.text}`}>
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
  const tierNumber = getTierNumber(item.tooltip?.Element_001?.value?.leftStr2);

  return (
    <div className="design-card flex h-[60px] gap-1.5 rounded border border-white/5 p-1.5 transition-colors hover:border-amber-500/30">
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
          <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded bg-amber-600/90 text-center text-[12px] leading-[14px] font-bold text-white">
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
    <div className="design-card flex h-[60px] gap-1.5 rounded border border-white/5 p-1.5 transition-colors hover:border-amber-500/30">
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
          <div key={iIdx} className="flex items-center gap-1.5 text-[12px]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${ins.isDebuff ? "bg-red-500" : "bg-blue-400"}`}
            />
            <span
              className={`text-sm ${ins.isDebuff ? "text-red-400" : "text-slate-300"}`}
            >
              {ins.name}
            </span>
            <span
              className={`text-sm font-black ${ins.isDebuff ? "text-red-500" : "text-blue-400"}`}
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
    <div className="design-card rounded-lg border border-white/10 p-0">
      <div className="border-b border-white/10 p-3">
        <h3 className="text-sm font-bold">전투 특성</h3>
      </div>
      <div className="space-y-2 p-3">
        {stats?.map((stat: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-emerald-400">{stat.Type}</span>
            <div className="flex items-center gap-1">
              {topValues[2] === Number(stat.Value) && (
                <Crown className="h-3.5 w-3.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              )}
              {topValues[3] === Number(stat.Value) && (
                <Flame className="h-3.5 w-3.5 text-violet-400 drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]" />
              )}
              <span
                className={`font-bold ${
                  topValues[2] === Number(stat.Value)
                    ? "text-emerald-400"
                    : topValues[3] === Number(stat.Value)
                      ? "text-violet-400"
                      : ""
                }`}
              >
                {stat.Value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectibleSummary() {
  return (
    <div className="design-card rounded-lg border border-white/10 p-0">
      <div className="border-b border-white/10 p-3">
        <h3 className="text-sm font-bold">수집형 포인트</h3>
      </div>
      <div className="space-y-2 p-3">
        {COLLECTIBLES_SUMMARY.map((col, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-gray-500">{col.name}</span>
            <span className="font-bold">
              {col.value} / {col.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectibleTab() {
  return (
    <div className="design-card rounded-lg border border-white/10 p-0">
      <div className="border-b border-white/10 p-3">
        <h3 className="font-bold">수집형 포인트</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 p-3">
        {COLLECTIBLES.map((col, idx) => (
          <div key={idx} className="rounded border border-white/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">{col.icon}</span>
              <p className="text-sm font-bold">{col.name}</p>
            </div>
            <p className="text-right">
              <span className="font-bold text-emerald-400">{col.value}</span>
              <span className="text-gray-500"> / {col.max}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderTab({ text }: { text: string }) {
  return (
    <div className="design-card rounded-lg border border-white/10 p-12 text-center">
      <p className="text-gray-500">{text}</p>
    </div>
  );
}
