"use client";

import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../common/Card";
import { Activity, History } from "lucide-react";
import { useCharacterHistory } from "@/hooks/query/lostark/character/useCharacterHistory";
import { CharacterHistorySkeleton } from "../common/CardSkeleton";

export function CharacterHistory({ name }: { name: string }) {
  const { data, isLoading } = useCharacterHistory(name, {
    period: "all",
    includeStats: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const chartData = useMemo(() => {
    if (!data?.history?.length) return [];
    return [...data.history]
      .sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
      )
      .map((log: any) => {
        const d = new Date(log.recorded_at);
        return {
          name: `${d.getMonth() + 1}/${d.getDate()}`,
          level: log.item_level,
          cp: log.combat_power,
          fullDate: d.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
          }),
          year: d.getFullYear(),
          time: d.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });
  }, [data]);

  if (!mounted || isLoading) return <CharacterHistorySkeleton />;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 px-0 pb-20 antialiased sm:space-y-8 sm:px-1">
      <Card
        className="overflow-hidden border-x-0 border-white/[0.06] bg-[#061a1a]/40 shadow-2xl sm:border-x"
        title={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
            <h2 className="text-[14px] font-black tracking-widest text-slate-100 uppercase sm:text-[15px]">
              성장 궤적
            </h2>
            <div className="flex items-center gap-3 border-t border-white/10 pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                Peak
              </span>
              <span className="font-mono text-sm font-black text-[#bef264]">
                {data?.stats?.maxLevel?.toFixed(2)}
              </span>
            </div>
          </div>
        }
        icon={<Activity size={18} className="text-[#bef264]" />}
        headerAction={
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Total {data?.stats?.totalChanges} Logs
            </span>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
          </div>
        }
      >
        <div className="h-[300px] w-full p-2 pt-16 sm:h-[450px] sm:p-10 sm:pt-20">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 10, left: -30, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bef264" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#bef264" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="6 6"
                  vertical={false}
                  stroke="#ffffff"
                  opacity={0.03}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }}
                  dy={15}
                  interval="preserveStartEnd"
                />
                <YAxis hide domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#bef264", strokeWidth: 0.5 }}
                />
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke="#bef264"
                  strokeWidth={2.5}
                  fill="url(#chartGlow)"
                  animationDuration={2000}
                  dot={{
                    r: 3,
                    fill: "#061a1a",
                    stroke: "#bef264",
                    strokeWidth: 1.5,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#bef264",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center opacity-30">
              <History size={40} className="mb-4 text-slate-700" />
              <p className="text-[11px] font-black tracking-[0.3em] text-white uppercase italic">
                데이터가 쌓이면 성장 궤적이 그려집니다
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { fullDate, time, level, cp } = payload[0].payload;
    return (
      <div className="shadow-3xl min-w-[180px] rounded-2xl border border-white/10 bg-[#061a1a]/95 p-4 ring-1 ring-[#bef264]/20 sm:p-5">
        <div className="mb-3 flex items-end justify-between border-b border-white/5 pb-2">
          <span className="text-[12px] font-bold text-slate-200">
            {fullDate}
          </span>
          <span className="font-mono text-[9px] text-slate-300">{time}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="mb-0.5 text-[8px] font-black tracking-widest text-[#bef264] uppercase opacity-60">
              Level
            </span>
            <span className="font-mono text-base font-black text-white">
              {level?.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="mb-0.5 text-[8px] font-black tracking-widest text-indigo-400 uppercase opacity-60">
              Power
            </span>
            <span className="w-full truncate font-mono text-xs font-black text-slate-300">
              {cp?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
