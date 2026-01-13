"use client";

import { useCProfile } from "@/hooks/query/useLostarkApi";
import { Suspense, useState } from "react";
import Loading from "@/app/loading";
import { TABS } from "@/constants/lostark/option";
import Equipment from "./equipment/Equipment";
import { CharacterHeader } from "./CharacterHeader";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CharacterContent({ name }: { name: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "equipment";

  const { data: profileData, isLoading: isProfileLoading } = useCProfile(name);

  const topValues = [...(profileData?.Stats || [])]
    .map(s => Number(s.Value))
    .sort((a, b) => b - a)
    .slice(0, 4);

  if (isProfileLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-2">
      <TabNavigation activeTab={activeTab} characterName={name} />
      <CharacterHeader profileData={profileData} />

      {activeTab === "equipment" && (
        <Equipment
          name={name}
          topValues={topValues}
          profileData={profileData}
        />
      )}
      {/* {activeTab === "avatar" && <Avatar name={name} />}
      {activeTab === "skill" && <Skill name={name} />}
      {activeTab === "history" && <History name={name} />}
      {activeTab === "characters" && <Characters name={name} />}
      {activeTab === "guild" && <Guild name={name} />} */}
    </div>
  );
}

export default function CharacterPage({ name }: { name: string }) {
  return (
    <Suspense fallback={<Loading />}>
      <CharacterContent name={name} />
    </Suspense>
  );
}

interface TabNavigationProps {
  activeTab: string;
  characterName: string;
}

export function TabNavigation({
  activeTab,
  characterName,
}: TabNavigationProps) {
  return (
    <div className="design-card overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-2">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <Link
            key={tab.id}
            href={`/characters/${characterName}?tab=${tab.id}`}
            className={`cursor-pointer rounded px-4 py-1 text-sm font-bold whitespace-nowrap transition-colors xl:px-5 xl:text-base ${
              activeTab === tab.id
                ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
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
