"use client";

import { useMemo } from "react";
import { useSiblings } from "@/hooks/query/lostark/character/useLostarkApi";
import { getClassIcon } from "@/utils/lostarkUtils";
import { cn } from "@/lib/utils";
import { WeeklyGoldDashboard } from "./list/WeeklyGoldDashboard";
import { CharacterListSkeleton } from "../common/CardSkeleton";
import { Card, EmptyCard } from "../common";
import { BadgeInfoIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function CharacterListLayout({ name }: { name: string }) {
  const { data: listData, isLoading } = useSiblings(name);
  const pathname = usePathname();

  const groupedServers = useMemo(() => {
    if (!listData) return {};
    const sortedData = [...listData].sort((a: any, b: any) => {
      const levelA = parseFloat(a.ItemAvgLevel.replace(/,/g, ""));
      const levelB = parseFloat(b.ItemAvgLevel.replace(/,/g, ""));
      return levelB - levelA;
    });
    return sortedData.reduce((acc: any, char: any) => {
      const server = char.ServerName || "Unknown";
      if (!acc[server]) acc[server] = [];
      acc[server].push(char);
      return acc;
    }, {});
  }, [listData]);

  if (!listData)
    return (
      <EmptyCard
        title={
          <div className="flex gap-2">
            <BadgeInfoIcon className="h-6 w-6 text-amber-500" />
            <span>내 캐릭터</span>
          </div>
        }
        message="캐릭터 정보가 없거나 점검으로 인해 정보가 없습니다."
      />
    );
  if (isLoading) return <CharacterListSkeleton />;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1400px] space-y-12 px-4 pb-20 sm:px-6",
        pathname === "/profile" && "pt-4"
      )}
    >
      <WeeklyGoldDashboard characters={listData} />

      {Object.entries(groupedServers).map(([serverName, characters]: any) => (
        <section key={serverName} className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h2 className="text-xl font-black tracking-tighter text-white uppercase">
              {serverName}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-[12px] font-bold tracking-widest text-slate-300 uppercase">
              {characters.length} CHARACTERS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {characters.map((char: any, idx: number) => (
              <CharacterPillCard
                key={`${char.CharacterName}-${idx}`}
                char={char}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CharacterPillCard({ char }: { char: any }) {
  const displayIcon =
    char.CharacterImage || getClassIcon(char.CharacterClassName);
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/characters/${char.CharacterName}`)}
      className="group relative h-fit cursor-pointer rounded-full transition-all duration-500 hover:translate-y-[-1px]"
      title={
        <div className="flex items-center gap-4">
          <div className="relative h-11 w-11 shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-slate-900 shadow-inner transition-transform duration-500 group-hover:scale-105">
              <img
                src={displayIcon}
                alt=""
                className={cn(
                  "h-full w-full rounded-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0",
                  !char.CharacterImage && "scale-110"
                )}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col leading-tight">
            <h4 className="truncate text-[15px] font-bold tracking-tight text-slate-200 transition-colors group-hover:text-white">
              {char.CharacterName}
            </h4>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase">
                {char.CharacterClassName}
              </span>
            </div>
          </div>
        </div>
      }
      headerAction={
        <div className="flex flex-col items-end justify-center border-l border-white/5 py-1 pl-4">
          <div className="flex items-baseline gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-widest text-slate-200 uppercase">
              Level
            </span>
            <span className="font-mono text-[9px] font-bold text-white tabular-nums">
              {char.CharacterLevel}
            </span>
          </div>
          <span className="font-mono text-[16px] font-black tracking-tight text-slate-100 tabular-nums transition-colors group-hover:text-[#bef264]">
            {char.ItemAvgLevel}
          </span>
        </div>
      }
      borderB={false}
    />
  );
}
