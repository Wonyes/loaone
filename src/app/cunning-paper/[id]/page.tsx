"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Sword,
  Shield,
  Zap,
  Target,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/Card";
import { useParams, useRouter } from "next/navigation";
import { useCunningEnd } from "@/hooks/query/lostark/paper/usePaper";

export default function RaidDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeGate, setActiveGate] = useState(1);

  const { data: raid, isLoading } = useCunningEnd(id);

  if (isLoading)
    return (
      <div className="p-20 text-center font-mono text-slate-500">
        LOADING SYSTEM...
      </div>
    );
  if (!raid)
    return <div className="p-20 text-center text-slate-500">NO DATA</div>;

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
    <Card
      title={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="text-slate-500 transition-colors hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
                {raid.name}
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-sm font-bold tracking-normal text-indigo-500">
                  G{activeGate}
                </span>
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
                  {raid.difficulty}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/10" />
                <p className="text-[11px] font-medium text-slate-500 uppercase">
                  {currentGate?.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      headerAction={
        <div className="flex rounded-lg border border-white/5 bg-white/5 p-1">
          {raid.raid_gates
            ?.sort((a: any, b: any) => a.gate_number - b.gate_number)
            .map((gate: any) => (
              <button
                key={gate.id}
                onClick={() => setActiveGate(gate.gate_number)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-[10px] font-black tracking-tighter transition-all",
                  activeGate === gate.gate_number
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                GATE {gate.gate_number}
              </button>
            ))}
        </div>
      }
      className="mx-auto max-w-[1000px] space-y-4"
    >
      <div className="grid grid-cols-1 items-start gap-8 px-4 py-2 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-8">
          <Card
            className="overflow-hidden border-white/5 bg-transparent"
            title="LOADOUT"
          >
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-indigo-400">
                  <Sword size={12} /> DEALER
                </div>
                <div className="text-right font-medium text-slate-300">
                  {items.dealer}
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Shield size={12} /> SUPPORT
                </div>
                <div className="text-right font-medium text-slate-300">
                  {items.support}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <AlertCircle size={14} className="mt-0.5 text-slate-400" />
            <p className="text-[12px] leading-relaxed font-black text-slate-400">
              보스 기믹 실패 시 전멸 위험이 있는 구간은 붉은색으로 강조되어
              있습니다.
            </p>
          </div>
        </aside>

        <section className="relative pl-2">
          <div className="absolute top-4 left-[38px] h-[calc(100%-32px)] w-[1px] bg-white/5" />

          <div className="space-y-1">
            {currentGate?.raid_sections
              ?.sort((a: any, b: any) => a.order_index - b.order_index)
              .map((section: any) => {
                const isWarning =
                  section.title.includes("즉사") ||
                  section.title.includes("전멸") ||
                  section.title.includes("저가");
                const [hp, ...titleParts] = section.title.split(":");
                const titleText = titleParts.join(":").trim() || hp;

                return (
                  <div
                    key={section.id}
                    className="group relative flex items-start gap-4 rounded-xl px-2 py-5 transition-all hover:bg-white/[0.02] md:gap-6"
                  >
                    <div className="relative z-10 mt-[-4px] flex h-8 w-8 shrink-0 items-center justify-center">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full border transition-all duration-300",
                          isWarning
                            ? "border-red-400 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                            : "border-slate-600 bg-slate-800 group-hover:border-indigo-400 group-hover:bg-indigo-500"
                        )}
                      />
                    </div>

                    <div className="w-14 shrink-0 pt-0.5">
                      <span
                        className={cn(
                          "block font-mono text-sm font-black tracking-tighter italic",
                          isWarning
                            ? "text-red-500"
                            : "text-slate-500 group-hover:text-white"
                        )}
                      >
                        {hp.trim()}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-start md:justify-between lg:gap-12">
                      <div className="min-w-0 flex-1">
                        <h3
                          className={cn(
                            "text-[15px] leading-snug font-medium tracking-tight transition-colors",
                            isWarning
                              ? "text-red-400"
                              : "text-slate-200 group-hover:text-indigo-300"
                          )}
                        >
                          {titleText}
                        </h3>
                      </div>

                      <div className="md:w-3/5 lg:w-1/2">
                        <p className="text-[13px] leading-relaxed font-bold text-violet-400 transition-colors group-hover:text-slate-300 md:text-right">
                          {section.subtitle}
                        </p>

                        <div className="mt-2 h-px w-4 bg-white/5 md:hidden" />
                      </div>
                    </div>

                    <Target
                      size={14}
                      className="mt-1 hidden opacity-0 transition-opacity group-hover:opacity-20 lg:block"
                    />
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </Card>
  );
}
