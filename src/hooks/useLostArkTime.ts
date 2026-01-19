import { useMemo } from "react";

export function useLostArkTime(currentTime: Date) {
  const result = useMemo(() => {
    const now = new Date(currentTime);
    const resetDate = new Date(now);
    if (now.getHours() < 6) resetDate.setDate(now.getDate() - 1);

    const nextReset = new Date(resetDate);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(6, 0, 0, 0);

    return {
      lostArkDayStr: resetDate.toISOString().split("T")[0],
      nextResetTime: nextReset,
    };
  }, [currentTime.toDateString(), currentTime.getHours() < 6]);

  return result;
}

export function useScheduleData(
  calendar: any,
  nextResetTime: Date,
  lostArkDayStr: string
) {
  const parsedEvents = useMemo(() => {
    if (!calendar) return [];
    return calendar.map((event: any) => ({
      ...event,
      parsedTimes:
        event.StartTimes?.map((t: string) => {
          const eventTime = new Date(t);
          if (event.CategoryName === "카오스게이트")
            eventTime.setMinutes(eventTime.getMinutes() + 10);
          return eventTime;
        }) || [],
    }));
  }, [calendar]);

  const todayIslands = useMemo(() => {
    if (!parsedEvents.length) return [];
    return parsedEvents.filter(
      (e: any) =>
        e.CategoryName === "모험 섬" &&
        e.StartTimes?.some((t: string) => t.startsWith(lostArkDayStr))
    );
  }, [parsedEvents, lostArkDayStr]);

  const eventTimers = useMemo(() => {
    const getNextEventTarget = (categoryNames: string[]): Date | null => {
      if (!parsedEvents.length) return null;
      const now = new Date();
      return (
        parsedEvents
          .filter((e: any) => categoryNames.includes(e.CategoryName))
          .flatMap((e: any) => e.parsedTimes)
          .filter((t: Date) => t > now && t < nextResetTime)
          .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0] || null
      );
    };

    const timers = [
      {
        label: "Island",
        icon: "🏝️",
        targetTime: getNextEventTarget(["모험 섬"]),
        color: "text-emerald-400",
      },
      {
        label: "Boss",
        icon: "⚔️",
        targetTime: getNextEventTarget(["필드보스"]),
        color: "text-rose-400",
      },
      {
        label: "Gate",
        icon: "🌀",
        targetTime: getNextEventTarget(["카오스게이트"]),
        color: "text-blue-400",
      },
    ];

    return timers;
  }, [parsedEvents, nextResetTime]);

  return { todayIslands, eventTimers };
}
