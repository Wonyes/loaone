"use client";

import { useCProfile } from "@/hooks/query/useLostarkApi";
import { Gem, Sword } from "lucide-react";
import { useState } from "react";
import Loading from "@/app/loading";
import { TABS } from "@/constants/lostark/option";
import Equipment from "../ui/equipment/Equipment";

export default function CharacterPage({ name }: { name: string }) {
  const [activeTab, setActiveTab] = useState("equipment");
  const { data: profileData, isLoading: isProfileLoading } = useCProfile(name);

  const topValues = [...(profileData?.Stats || [])]
    .map(s => Number(s.Value))
    .sort((a, b) => b - a)
    .slice(0, 4);

  if (isProfileLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-2">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <CharacterHeader profileData={profileData} />

      {activeTab === "equipment" && (
        <Equipment
          name={name}
          topValues={topValues}
          profileData={profileData}
        />
      )}
      {activeTab === "avatar" && <PlaceholderTab text="아바타 정보" />}
      {activeTab === "skill" && <PlaceholderTab text="스킬 정보" />}
      {activeTab === "history" && <PlaceholderTab text="히스토리 정보" />}
      {activeTab === "characters" && <PlaceholderTab text="보유 캐릭터 정보" />}
      {activeTab === "guild" && <PlaceholderTab text="길드 정보" />}
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
            className={`cursor-pointer rounded px-4 py-1 text-sm font-bold whitespace-nowrap transition-colors xl:px-5 xl:text-base ${
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
    <div className="design-card relative overflow-hidden rounded-xl bg-slate-900/50 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />

      {/* 캐릭터 이미지 - 항상 표시, 반응형 크기 */}
      {profileData?.CharacterImage && (
        <img
          src={profileData.CharacterImage}
          alt={profileData.CharacterName}
          className="pointer-events-none absolute top-[5px] left-1/2 h-[400px] w-[280px] -translate-x-1/2 scale-[1.2] object-cover object-[50%_15%] mix-blend-lighten drop-shadow-[0_0_80px_rgba(168,85,247,0.55)] sm:h-[480px] sm:w-[320px] xl:h-[520px] xl:w-[360px] xl:scale-[1.3]"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 30% 80%, transparent), linear-gradient(to top, transparent 5%, black 55%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 30% 80%, transparent), linear-gradient(to top, transparent 5%, black 55%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
      )}

      <div className="relative z-10 flex min-h-[200px] flex-col items-start justify-between gap-4 p-4 sm:min-h-[220px] xl:min-h-[240px] xl:flex-row xl:items-end xl:gap-6 xl:p-6">
        <div className="flex flex-col gap-3 xl:gap-6">
          {/* 레벨 & 전투력 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 xl:gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/20 p-2">
                <Gem className="h-4 w-4 text-emerald-400 xl:h-5 xl:w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 sm:text-sm">아이템 레벨</p>
                <p className="text-lg font-black text-emerald-400 sm:text-xl">
                  {profileData?.ItemAvgLevel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-500/20 p-2">
                <Sword className="h-4 w-4 text-violet-400 xl:h-5 xl:w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 sm:text-sm">전투력</p>
                <p className="text-lg font-black text-violet-400 sm:text-xl">
                  {profileData?.CombatPower?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 캐릭터 정보 */}
          <div>
            <div className="mb-2 flex flex-wrap gap-2 xl:mb-3">
              <span className="rounded-lg bg-slate-800/80 px-2 py-1 text-xs font-semibold text-gray-300 sm:px-3 sm:py-1.5 sm:text-sm">
                {profileData?.ServerName}
              </span>
              <span className="rounded-lg bg-slate-800/80 px-2 py-1 text-xs font-semibold text-gray-300 sm:px-3 sm:py-1.5 sm:text-sm">
                {profileData?.CharacterClassName}
              </span>
            </div>

            <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl xl:mb-3 xl:text-4xl">
              {profileData?.CharacterName}
            </h1>

            <div className="flex flex-wrap gap-3 text-xs sm:gap-4 sm:text-sm xl:gap-6">
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

        {/* 길드/영지 정보 */}
        <div className="flex flex-col gap-1.5 text-xs sm:gap-2 sm:text-sm">
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

function PlaceholderTab({ text }: { text: string }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-12 text-center">
      <p className="text-gray-500">{text}</p>
    </div>
  );
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-white/10 bg-slate-900/30 p-4">
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}
