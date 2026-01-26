"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

interface Props {
  targetTime: Date | null;
  label: string;
  icon: string;
  color: string;
}

function arePropsEqual(prevProps: Props, nextProps: Props) {
  return (
    prevProps.label === nextProps.label &&
    prevProps.icon === nextProps.icon &&
    prevProps.color === nextProps.color &&
    prevProps.targetTime?.getTime() === nextProps.targetTime?.getTime()
  );
}

export const CountdownTimer = memo(function CountdownTimer({
  targetTime,
  label,
  icon,
  color,
}: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.01] p-4">
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
  );
}, arePropsEqual);
