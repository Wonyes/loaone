"use client";

import { useState } from "react";
import { ChevronLeft, Sword, Shield, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useCunningEnd } from "@/hooks/query/lostark/paper/usePaper";
import { Card } from "@/components/common";

export default function RaidDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeGate, setActiveGate] = useState(1);

  const { data: raid, isLoading } = useCunningEnd(id);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center font-mono text-xs tracking-[0.2em] text-indigo-500/50">
        LOADING_RAID_DATA...
      </div>
    );
  if (!raid)
    return <div className="p-20 text-center text-slate-300">NO DATA</div>;

  const currentGate =
    raid.raid_gates?.find((g: any) => g.gate_number === activeGate) ||
    raid.raid_gates?.[0];

  const parseItems = (text: string) => {
    if (!text) return { dealer: "-", support: "-" };
    const parts = text.split("|");
    return {
      dealer: parts[0]?.replace("딜:", "").trim() || "-",
      support: parts[1]?.replace("서폿:", "").trim() || "-",
    };
  };
  const items = parseItems(currentGate?.subtitle);

  return (
    <div className="relative max-w-[1400px] p-6 text-slate-200">
      {/* 상단 헤더: 택티컬 브리핑 스타일 */}
      <header className="mb-12">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.back()}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10"
            >
              <ChevronLeft
                size={20}
                className="text-slate-400 group-hover:text-indigo-400"
              />
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.3em] text-indigo-500 uppercase">
                  Tactical Briefing
                </span>
                <span className="h-px w-8 bg-indigo-500/30" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white">
                {raid.name}
              </h1>
              <p className="w-fit rounded border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-sm tracking-widest text-purple-400">
                {raid.difficulty}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-xl border border-white/5 bg-black/40 p-1.5 backdrop-blur-md">
            {raid.raid_gates
              ?.sort((a: any, b: any) => a.gate_number - b.gate_number)
              .map((gate: any) => (
                <button
                  key={gate.id}
                  onClick={() => setActiveGate(gate.gate_number)}
                  className={cn(
                    "relative flex h-9 items-center justify-center rounded-lg px-5 font-mono text-[11px] font-bold transition-all",
                    activeGate === gate.gate_number
                      ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  G{gate.gate_number}
                </button>
              ))}
          </nav>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr]">
        {/* 사이드바: 정보 모듈화 */}
        <aside className="space-y-6">
          <Card
            title={"Recommended Loadout"}
            icon={<Zap size={18} className="text-indigo-400" />}
            className="rounded-xl before:rounded-xl"
          >
            <div className="space-y-6 p-4">
              <div className="group relative">
                <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-indigo-400 uppercase">
                  <Sword size={14} /> Dealer Items
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm leading-relaxed text-slate-300 transition-colors group-hover:border-indigo-500/30">
                  {items.dealer}
                </div>
              </div>

              <div className="group relative">
                <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-emerald-400 uppercase">
                  <Shield size={14} /> Support Items
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm leading-relaxed text-slate-300 transition-colors group-hover:border-emerald-500/30">
                  {items.support}
                </div>
              </div>
            </div>
          </Card>
        </aside>

        {/* 메인 섹션: 타임라인 스타일 */}
        <div className="relative">
          {/* 수직 타임라인 레일 */}
          <div className="absolute top-4 bottom-4 left-[21px] w-[1px] bg-indigo-900 opacity-80" />

          <section className="space-y-8">
            {currentGate?.raid_sections
              ?.sort((a: any, b: any) => a.order_index - b.order_index)
              .map((section: any) => {
                const [hp, ...titleParts] = section.title.split(":");
                const titleText = titleParts.join(":").trim() || hp;

                return (
                  <div key={section.id} className="group relative pl-12">
                    <div
                      className={
                        "absolute top-1 left-0 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border-4 border-slate-900 bg-slate-900 text-indigo-500 transition-transform group-hover:scale-110"
                      }
                    >
                      <div
                        className={
                          "flex h-full w-full items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/10"
                        }
                      >
                        <Target size={14} />
                      </div>
                    </div>

                    <Card
                      className={
                        "relative overflow-hidden rounded-xl transition-all before:rounded-xl hover:bg-white/[0.04]"
                      }
                      title={
                        <div className="flex items-center gap-1">
                          <span
                            className={"text-[14px] font-black text-indigo-400"}
                          >
                            {hp.trim()}
                          </span>
                          <h3 className={"text-[12px] text-slate-300"}>
                            {titleText}
                          </h3>
                        </div>
                      }
                    >
                      <p className="max-w-[600px] p-4 text-sm leading-relaxed text-slate-300 transition-colors group-hover:text-slate-300">
                        {section.subtitle}
                      </p>
                    </Card>
                  </div>
                );
              })}
          </section>
        </div>
      </div>
    </div>
  );
}
