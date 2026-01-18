"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { notFound, useSearchParams } from "next/navigation";

import { TABS } from "@/constants/lostark/option";
import {
  useArkpassive,
  useProfile,
} from "@/hooks/query/lostark/character/useLostarkApi";

import Loading from "@/app/loading";
import Equipment from "./equipment/Equipment";
import { CharacterHeader } from "./CharacterHeader";
import AvatarPage from "./AvatarPage";
import { CharacterSkillPage } from "./SkillPage";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";
import { CharacterListLayout } from "./CharacterList";
import { CharacterHistory } from "./CharacterHistory";
import { CharacterCollectible } from "./CharacterCollectible";
import { CharacterHeaderSkeleton } from "../common/CardSkeleton";

function CharacterContent({ name }: { name: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "equipment";

  const { data: profileData, isLoading: isProfileLoading } = useProfile(name);
  const { data: arkpassiveData, isLoading: isAkrpassiveLoading } =
    useArkpassive(name);

  const mainPassiveName = useMemo(() => {
    if (!profileData || !arkpassiveData) return "정보 없음";
    const className = profileData.CharacterClassName;
    const supports = ["바드", "도화가", "홀리나이트"];
    const targetIndex = supports.includes(className) ? 1 : 0;
    const description =
      arkpassiveData.Effects?.[targetIndex]?.Description || "";
    const match = description.match(/\d티어\s+(.*?)\s+Lv\./);
    return match ? match[1].trim() : "정보 없음";
  }, [profileData, arkpassiveData]);

  const topValues = useMemo(() => {
    if (!profileData?.Stats) return [];
    return [...profileData.Stats]
      .map(s => Number(s.Value.replace(/,/g, "")))
      .sort((a, b) => b - a)
      .slice(0, 4);
  }, [profileData]);

  const isLoading = isProfileLoading || isAkrpassiveLoading;
  if (!isLoading && (!profileData || !arkpassiveData)) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-4 pb-4">
      {isLoading ? (
        <CharacterHeaderSkeleton />
      ) : (
        <CharacterHeader
          name={name}
          profileData={profileData}
          mainPassiveName={mainPassiveName}
        />
      )}

      <div className="sticky top-20 z-30 -mx-2 px-4 sm:mx-0 sm:px-0">
        <TabNavigation activeTab={activeTab} characterName={name} />
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-2 mt-2 duration-500">
        {activeTab === "equipment" && (
          <Equipment
            name={name}
            topValues={topValues}
            profileData={profileData}
            arkpassiveData={arkpassiveData}
            isAkrpassiveLoading={isAkrpassiveLoading}
          />
        )}
        {activeTab === "avatar" && (
          <AvatarPage profileData={profileData} name={name} />
        )}
        {activeTab === "skill" && (
          <CharacterSkillPage
            name={name}
            stats={profileData?.Stats || []}
            mainPassiveName={mainPassiveName}
            usingSkillPoint={profileData?.UsingSkillPoint || "0"}
            totalSkillPoint={profileData?.TotalSkillPoint || "0"}
          />
        )}
        {activeTab === "history" && <CharacterHistory name={name} />}
        {activeTab === "collectible" && <CharacterCollectible name={name} />}
        {activeTab === "characters" && <CharacterListLayout name={name} />}
      </main>
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

export function TabNavigation({
  activeTab,
  characterName,
}: TabNavigationProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[1400px] justify-center px-1">
      <nav
        className={cn(
          "flex items-center gap-1 overflow-x-auto px-2 pt-1.5 pb-1.5",
          "rounded-3xl border border-[#bef264]/10 bg-[#061a1a]/95 shadow-2xl",
          "scrollbar-thin [&::-webkit-scrollbar]:h-[3px]",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-[#bef264]/10",
          "hover:[&::-webkit-scrollbar-thumb]:bg-[#bef264]/30"
        )}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/characters/${characterName}?tab=${tab.id}`}
              className={cn(
                "group relative flex min-w-[70px] shrink-0 items-center justify-center rounded-3xl px-3.5 py-1.5 text-[11px] font-black tracking-[0.1em] uppercase transition-all duration-300 sm:min-w-[85px]",
                isActive
                  ? "bg-gradient-to-b from-[#bef264]/15 to-transparent text-[#bef264] shadow-inner ring-1 ring-[#bef264]/20"
                  : "text-teal-100/20 hover:bg-white/[0.02] hover:text-teal-100/70"
              )}
            >
              <span className="relative z-10 text-[13px] font-black font-bold tracking-[0.05em] uppercase italic">
                {tab.label}
              </span>

              {isActive && (
                <>
                  <div className="animate-in zoom-in fade-in absolute -top-0.5 -right-0.5 z-20 duration-500">
                    <Leaf
                      size={14}
                      className="rotate-[15deg] fill-[#bef264] text-[#bef264] drop-shadow-[0_0_5px_rgba(190,242,100,0.8)]"
                    />
                  </div>

                  <div className="animate-in zoom-in fade-in absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#bef264] shadow-[0_0_10px_#bef264] duration-500" />
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

interface TabNavigationProps {
  activeTab: string;
  characterName: string;
}
