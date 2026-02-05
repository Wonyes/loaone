"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCunningList } from "@/hooks/query/lostark/paper/usePaper";
import { Card, Input } from "../common";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "ALL",
  "카제로스",
  "군단장",
  "어비스",
  "가디언",
  "그림자 레이드",
];

const THEME_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  카제로스: {
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-500/20",
  },
  군단장: {
    text: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-500/20",
  },
  어비스: {
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-500/20",
  },
  가디언: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-500/20",
  },
  그림자레이드: {
    text: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-500/20",
  },
  default: {
    text: "text-zinc-400",
    bg: "bg-zinc-400/10",
    border: "border-white/10",
  },
};

export default function RaidListClient({
  initialRaids,
}: {
  initialRaids: any[];
}) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useCunningList<any>(initialRaids);

  const filteredRaids = data?.filter((raid: any) => {
    const matchesSearch = raid.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "ALL" || raid.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-16 text-zinc-100 antialiased">
      <header className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic sm:text-5xl">
            RAID
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text pr-1 text-transparent">
              PAPER
            </span>
          </h1>
          <p className="text-sm font-medium tracking-tight text-slate-400">
            숙련을 넘어 숙제로, 핵심 기믹의 정수만 담았습니다.
          </p>
        </div>
        <div className="w-full md:w-80">
          <Input
            name="raidSearch"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="레이드명을 입력 하세요"
            showSearchButton
          />
        </div>
      </header>

      <nav className="mb-10 flex flex-wrap items-center gap-2">
        {CATEGORIES.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-xl px-4 py-2 text-[13px] font-bold transition-all duration-200",
              activeTab === tab
                ? "bg-white/[0.06] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {isLoading
          ? [1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-white/5"
              />
            ))
          : filteredRaids?.map((raid: any) => (
              <RaidCard key={raid.id} raid={raid} />
            ))}
      </div>
    </div>
  );
}

function RaidCard({ raid }: { raid: any }) {
  const router = useRouter();

  const theme = THEME_COLORS[raid.type] || THEME_COLORS.default;
  return (
    <Card
      onClick={() => router.push(`/cunning-paper/${raid.id}`)}
      className="relative cursor-pointer rounded-2xl p-1 transition-all duration-300 before:rounded-2xl hover:border-white/20 hover:bg-zinc-900/60"
      title={
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <span
              className={cn(
                "text-[12px] font-bold tracking-widest",
                theme.text
              )}
            >
              {raid.type}
            </span>
            <h3 className="text-lg font-bold tracking-tight text-white transition-colors">
              {raid.name}
            </h3>
          </div>
        </div>
      }
      headerAction={
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="space-y-0.5 sm:space-y-1">
              <p className="font-mono text-[9px] font-bold tracking-widest text-gray-500 uppercase sm:text-[11px]">
                Rank
              </p>
              <p
                className={cn(
                  "text-[11px] font-bold tracking-tight text-zinc-300 uppercase sm:text-[12px]",
                  theme.text
                )}
              >
                {raid.difficulty}
              </p>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="space-y-0.5 sm:space-y-1">
              <p className="font-mono text-[9px] font-bold tracking-widest text-gray-500 uppercase sm:text-[11px]">
                gates
              </p>
              <p
                className={cn(
                  "text-[11px] font-bold tracking-tight text-zinc-300 uppercase sm:text-[12px]",
                  theme.text
                )}
              >
                {raid.gate_count}Gates
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] sm:h-10 sm:w-10">
            <ChevronRight size={16} className="sm:h-[18px] sm:w-[18px]" />
          </div>
        </div>
      }
      borderB={false}
    />
  );
}
