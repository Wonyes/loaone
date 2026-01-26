"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/common/Card";
import { usePopularSearches } from "@/hooks/query/lostark/usePopularSearches";
import { FavoritesSkeleton } from "../common";

export default function PopularSearchPage() {
  const { data: popularSearch = [], isLoading } = usePopularSearches();

  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  return (
    <Card
      title="Top Search"
      icon={<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
    >
      <div className="p-2">
        <div className="no-scrollbar max-h-[400px] space-y-1 overflow-y-auto">
          {popularSearch.slice(0, 5).map((char: any, index: number) => (
            <FavoriteCharacter
              key={char.character_name}
              char={char}
              rank={index}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function FavoriteCharacter({ rank, char }: { rank: number; char: any }) {
  const getRankEmoji = (rank: number) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return rank + 1;
  };
  return (
    <Link
      href={`/characters/${char.character_name}`}
      className="group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all hover:bg-white/[0.05]"
    >
      <div className="items-top flex gap-1">
        <span className="w-6 text-center text-white">{getRankEmoji(rank)}</span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[13px] font-bold text-slate-200 transition-colors group-hover:text-indigo-400">
            {char.character_name}
          </span>
          <span className="truncate text-[10px] text-slate-400">
            {char.class}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5 font-mono">
        <span className="text-[11px] font-black tracking-tighter text-indigo-400/90">
          <span className="mr-0.5 text-[10px] text-slate-400 italic">Lv</span>
          {char.item_level}
        </span>
        <span className="text-[12px] font-black tracking-tighter text-indigo-400/90">
          {char.server_name}
        </span>
        <div className="h-px w-2 bg-white/10 transition-all group-hover:w-6 group-hover:bg-indigo-500/50" />
      </div>
    </Link>
  );
}
