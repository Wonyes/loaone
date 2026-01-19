"use client";

import { useCalendar } from "@/hooks/query/lostark/news/useNews";
import { memo, useEffect, useMemo, useState } from "react";
import { Card } from "../common/Card";
import { getGradeStyle } from "@/utils/lostarkUtils";
import { IslandRewardModal } from "./IslandRewardModal";
import { useLostArkTime, useScheduleData } from "@/hooks/useLostArkTime";
import { cn } from "@/lib/utils";
import { EventTimerSkeleton, IslandCardSkeleton } from "../common/CardSkeleton";

export function TodaySchedule() {
  const { data: calendar, isLoading } = useCalendar();
  const [selectedIsland, setSelectedIsland] = useState<any>(null);

  const currentDate = useMemo(() => {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  }, []);

  const { lostArkDayStr, nextResetTime } = useLostArkTime(currentDate);
  const { todayIslands, eventTimers } = useScheduleData(
    calendar,
    nextResetTime,
    lostArkDayStr
  );

  if (isLoading || !calendar) {
    return (
      <div className="relative mx-auto max-w-3xl space-y-4 bg-transparent p-4">
        <div className="border-b border-white/5 pb-5">
          <div className="flex justify-center gap-5">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
                <div className="h-5 w-6 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <EventTimerSkeleton />
          <EventTimerSkeleton />
          <EventTimerSkeleton />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <IslandCardSkeleton />
          <IslandCardSkeleton />
          <IslandCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-3xl space-y-4 bg-transparent p-4 text-slate-200 antialiased">
      <MemoizedWeekHeader lostArkDayStr={lostArkDayStr} />
      <EventTimerSection eventTimers={eventTimers} />
      <MemoizedIslandGrid
        islands={todayIslands.slice(0, 3)}
        onSelectIsland={setSelectedIsland}
      />
      <IslandRewardModal
        island={selectedIsland}
        onClose={() => setSelectedIsland(null)}
      />
    </div>
  );
}

function IslandGrid({
  islands,
  onSelectIsland,
}: {
  islands: any[];
  onSelectIsland: (island: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase">
          Upcoming Islands
        </h3>
        <div className="ml-4 h-px flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {islands.map((island: any, idx: number) => (
          <IslandCard key={idx} island={island} onClick={onSelectIsland} />
        ))}
      </div>
    </div>
  );
}

function IslandCard({
  island,
  onClick,
}: {
  island: any;
  onClick: (island: any) => void;
}) {
  return (
    <div className="group relative">
      <Card
        onClick={() => onClick(island)}
        className="relative flex cursor-pointer flex-col justify-between border border-white/[0.03] bg-white/[0.01] p-3 transition-all hover:bg-white/[0.04] sm:pointer-events-none"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/5">
            <img
              src={island.ContentsIcon}
              alt={island.ContentsIcon}
              className="h-full w-full object-cover"
            />
          </div>
          <h4 className="truncate text-[12px] font-bold text-slate-300 group-hover:text-white">
            {island.ContentsName}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <IslandRewardPreview items={island.RewardItems?.[0]?.Items} />
          <div className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-indigo-400">
            Detail
          </div>
        </div>
      </Card>

      <div className="pointer-events-none absolute bottom-full left-0 z-50 mt-2 hidden w-[320px] rounded-xl border border-white/10 bg-[#0f0f11] p-4 shadow-2xl sm:group-hover:block">
        <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-3">
          <img
            src={island.ContentsIcon}
            alt=""
            className="h-10 w-10 rounded-lg border border-white/10"
          />
          <div>
            <h3 className="text-sm font-bold text-white">
              {island.ContentsName}
            </h3>
            <p className="text-[10px] text-slate-500">전체 보상 리스트</p>
          </div>
        </div>
        <div className="scrollbar-hide max-h-[300px] space-y-2 overflow-y-auto">
          {island.RewardItems?.[0]?.Items.map((item: any, i: number) => {
            const gradeStyle = getGradeStyle(item.Grade);
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 p-2"
              >
                <div
                  className={cn(
                    "h-6 w-6 shrink-0 rounded p-0.5",
                    gradeStyle.bg
                  )}
                >
                  <img
                    src={item.Icon}
                    alt={item.Name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xs text-slate-300">{item.Name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IslandRewardPreview({ items }: { items?: any[] }) {
  if (!items) return null;

  return (
    <div className="flex -space-x-1">
      {items.slice(0, 6).map((item: any, i: number) => {
        const gradeStyle = getGradeStyle(item.Grade);

        return (
          <div
            key={i}
            className={cn(
              "h-6 w-6 rounded border border-[#0a0a0b] p-0.5 shadow-sm",
              gradeStyle?.bg || "bg-slate-700"
            )}
          >
            <img
              src={item.Icon}
              alt={item.Name}
              className="h-full w-full object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}

const MemoizedWeekHeader = memo(function WeekHeader({
  lostArkDayStr,
}: {
  lostArkDayStr: string;
}) {
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const baseDate = useMemo(() => new Date(lostArkDayStr), [lostArkDayStr]);

  return (
    <nav className="flex items-end justify-center border-b border-white/5 px-1 pb-5">
      <div className="flex gap-5 sm:gap-7">
        {Array.from({ length: 7 }, (_, i) => {
          const date = new Date(baseDate);
          date.setDate(date.getDate() - date.getDay() + i);

          const dateStr = date.toISOString().split("T")[0];
          const isToday = dateStr === lostArkDayStr;

          return (
            <div key={i} className="group flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "text-[9px] font-bold tracking-widest",
                  isToday ? "text-indigo-400" : "text-slate-600"
                )}
              >
                {dayNames[i]}
              </span>
              <span
                className={cn(
                  "text-lg",
                  isToday
                    ? "scale-110 font-bold text-white"
                    : "font-light text-slate-500"
                )}
              >
                {date.getDate()}
              </span>
              {isToday && (
                <div className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
});

const MemoizedIslandGrid = memo(IslandGrid);

function EventTimerSection({
  eventTimers,
}: {
  eventTimers: { label: string; icon: string; targetTime: Date | null; color: string }[];
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {eventTimers.map((timer, idx) => (
        <EventTimerCard key={idx} {...timer} now={now} />
      ))}
    </div>
  );
}

function EventTimerCard({
  label,
  icon,
  targetTime,
  color,
  now,
}: {
  label: string;
  icon: string;
  targetTime: Date | null;
  color: string;
  now: Date;
}) {
  const timeStr = useMemo(() => {
    if (!targetTime) return null;
    const diff = targetTime.getTime() - now.getTime();
    if (diff <= 0) return null;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [targetTime, now]);

  return (
    <Card className="border-white/[0.05] bg-white/[0.01] p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "text-[10px] font-black tracking-widest uppercase",
              color
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              "font-mono text-xl font-bold tracking-tighter tabular-nums",
              color
            )}
          >
            {timeStr || "Passed"}
          </span>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
    </Card>
  );
}
