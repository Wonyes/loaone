"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { TABS } from "@/constants/lostark/option";
import {
  useCArkpassive,
  useCProfile,
} from "@/hooks/query/lostark/character/useLostarkApi";

import Loading from "@/app/loading";
import Equipment from "./equipment/Equipment";
import { CharacterHeader } from "./CharacterHeader";
import AvatarPage from "./AvatarPage";

function CharacterContent({ name }: { name: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "equipment";

  const { data: profileData, isLoading: isProfileLoading } = useCProfile(name);
  const { data: arkpassiveData, isLoading: isAkrpassiveLoading } =
    useCArkpassive(name);

  if (isProfileLoading || isAkrpassiveLoading) return <Loading />;

  const className = profileData?.CharacterClassName;

  const getTargetPassive = () => {
    const supports = ["바드", "도화가", "홀리나이트"];
    const targetIndex = supports.includes(className) ? 1 : 0;

    const description = arkpassiveData.Effects[targetIndex]?.Description || "";

    const match = description.match(/\d티어\s+(.*?)\s+Lv\./);
    return match ? match[1].trim() : "정보 없음";
  };
  const mainPassiveName = getTargetPassive();
  console.log(mainPassiveName, arkpassiveData, className);

  const topValues = [...(profileData?.Stats || [])]
    .map(s => Number(s.Value))
    .sort((a, b) => b - a)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-2">
      <TabNavigation activeTab={activeTab} characterName={name} />
      <CharacterHeader
        name={name}
        profileData={profileData}
        mainPassiveName={mainPassiveName}
      />

      {activeTab === "equipment" && (
        <Equipment
          name={name}
          topValues={topValues}
          profileData={profileData}
          arkpassiveData={arkpassiveData}
        />
      )}
      {activeTab === "avatar" && (
        <AvatarPage profileData={profileData} name={name} />
      )}
      {/* {activeTab === "skill" && <Skill name={name} />}
      {activeTab === "history" && <History name={name} />}
      {activeTab === "characters" && <Characters name={name} />}
      {activeTab === "guild" && <Guild name={name} />}  */}
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
    <div className="design-card rounded-xl border border-white/10 bg-slate-900/50 p-2">
      <div className="flex gap-1 overflow-x-auto">
        {TABS === null
          ? undefined
          : TABS.map(tab => (
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
