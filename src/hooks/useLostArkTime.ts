import { useMemo } from "react";

interface LostArkTime {
  lostArkDayStr: string;
  nextResetTime: Date;
}

export interface TimeRemaining {
  h: number;
  m: number;
  s: number;
}

export interface EventTimer {
  label: string;
  icon: string;
  time: TimeRemaining | null;
  color: string;
}

/**
 * 💡 로스트아크 기준 날짜 계산
 */
export function useLostArkTime(currentTime: Date): LostArkTime {
  return useMemo(() => {
    const now = new Date(currentTime);
    const resetDate = new Date(now);

    if (now.getHours() < 6) {
      resetDate.setDate(now.getDate() - 1);
    }

    const nextReset = new Date(resetDate);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(6, 0, 0, 0);

    return {
      lostArkDayStr: resetDate.toLocaleDateString("en-CA"),
      nextResetTime: nextReset,
    };
  }, [currentTime]);
}

export function useScheduleData(
  calendar: any,
  currentTime: Date,
  nextResetTime: Date,
  lostArkDayStr: string
) {
  const getNextEvent = (categoryNames: string[]): TimeRemaining | null => {
    if (!calendar) return null;

    const nextTime = calendar
      .filter((e: any) => categoryNames.includes(e.CategoryName))
      .flatMap((e: any) => e.StartTimes)
      .map((t: string) => new Date(t))
      .filter((t: Date) => t > currentTime && t < nextResetTime)
      .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0];

    if (!nextTime) return null;

    const diff = nextTime.getTime() - currentTime.getTime();
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };

  const todayIslands = useMemo(() => {
    if (!calendar) return [];
    return calendar.filter(
      (e: any) =>
        e.CategoryName === "모험 섬" &&
        e.StartTimes?.some((t: string) => t.startsWith(lostArkDayStr))
    );
  }, [calendar, lostArkDayStr]);

  const eventTimers: EventTimer[] = useMemo(
    () => [
      {
        label: "Island",
        icon: "🏝️",
        time: getNextEvent(["모험 섬"]),
        color: "text-emerald-400",
      },
      {
        label: "Boss",
        icon: "⚔️",
        time: getNextEvent(["필드보스", "필드 보스"]),
        color: "text-rose-400",
      },
      {
        label: "Gate",
        icon: "🌀",
        time: getNextEvent(["카오스게이트", "카오스 게이트"]),
        color: "text-blue-400",
      },
    ],
    [calendar, currentTime, nextResetTime]
  );

  return { todayIslands, eventTimers };
}
