"use client";

import { useState } from "react";
import { Search, ChevronRight, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCunningList } from "@/hooks/query/lostark/paper/usePaper";
import { Card } from "@/components/common/Card";

const CATEGORIES = ["ALL", "카제로스", "군단장", "어비스", "가디언"];

const THEME_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  카제로스: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  군단장: {
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  어비스: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  가디언: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  default: {
    text: "text-slate-400",
    bg: "bg-white/5",
    border: "border-white/10",
  },
};

interface Raid {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  gate_count: number;
}

interface RaidListClientProps {
  initialRaids: Raid[];
}

export default function RaidListClient({ initialRaids }: RaidListClientProps) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useCunningList<Raid>(initialRaids);

  const filteredRaids = data?.filter((raid: Raid) => {
    const matchesSearch = raid.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "ALL" || raid.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 p-6 py-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
            <Zap size={12} className="fill-indigo-400 text-indigo-400" />
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
              Ver 2.0 Live
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic sm:text-5xl">
            Raid
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Paper
            </span>
          </h1>
          <p className="text-sm font-medium tracking-tight text-slate-400">
            숙련을 넘어 숙제로, 핵심 기믹의 정수만 담았습니다.
          </p>
        </div>

        <div className="group relative w-full md:w-80">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-400" />
          <input
            type="text"
            placeholder="보스 이름 검색..."
            className="w-full rounded-xl border border-white/5 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-white backdrop-blur-xl transition-all outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-5 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-300",
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-[2rem] bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRaids?.map((raid: Raid) => (
            <RaidCard key={raid.id} raid={raid} />
          ))}
        </div>
      )}
    </div>
  );
}

function RaidCard({ raid }: { raid: Raid }) {
  const theme = THEME_COLORS[raid.type] || THEME_COLORS.default;

  return (
    <a
      href={`/cunning-paper/${raid.id}`}
      className="group block transition-all duration-300 hover:-translate-y-1"
    >
      <Card
        className="h-full border-white/5 transition-colors hover:border-indigo-500/30"
        title={
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 text-[12px] font-bold tracking-widest",
              theme.bg,
              theme.text,
              theme.border
            )}
          >
            {raid.type}
          </span>
        }
        headerAction={
          <span className="text-[11px] font-bold tracking-widest text-slate-400">
            {raid.gate_count} GATES / {raid.difficulty}
          </span>
        }
      >
        <div className="relative p-6 pt-2">
          <div
            className={cn(
              "absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-[40px] transition-opacity group-hover:opacity-25",
              theme.text.replace("text", "bg")
            )}
          />

          <div className="relative space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white/90 transition-colors group-hover:text-indigo-300">
                {raid.name}
              </h3>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.03] pt-4">
              <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-indigo-400/80 group-hover:text-indigo-300">
                VIEW GUIDELINE <ChevronRight size={10} />
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                <Target size={14} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}
