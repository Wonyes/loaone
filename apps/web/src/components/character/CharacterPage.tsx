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

  return (
    <div className="min-w-[1600px] overflow-x-auto">
      <div className="mx-auto w-[1600px] px-4">
        <div className="flex flex-col gap-2">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <CharacterHeader profileData={profileData} />

          <div className="flex gap-2">
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
            {activeTab === "characters" && (
              <PlaceholderTab text="보유 캐릭터 정보" />
            )}
            {activeTab === "guild" && <PlaceholderTab text="길드 정보" />}
          </div>
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
