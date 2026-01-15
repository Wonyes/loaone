"use client";

import { useCalendar } from "@/hooks/query/lostark/news/useNews";
import { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { GRADE_STYLES } from "@/constants/lostark/styles";

export function TodaySchedule() {
  const { data: calendar, isLoading } = useCalendar();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <div className="text-slate-400">로딩중...</div>;
  }

  const today = currentTime;
  const todayStr = today.toISOString().split("T")[0];

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  const todayEvents =
    calendar?.filter((event: any) => {
      return event.StartTimes?.some((time: string) =>
        time.startsWith(todayStr)
      );
    }) || [];

  const fieldBoss = todayEvents.find(
    (e: any) => e.CategoryName === "필드 보스"
  );
  const chaosGate = todayEvents.find(
    (e: any) => e.CategoryName === "카오스게이트"
  );
  const adventureIslands = todayEvents.filter(
    (e: any) => e.CategoryName === "모험 섬"
  );


 const getNextEventTime = (startTimes: string[]) => {
  const now = currentTime;
  const todayStr = now.toISOString().split("T")[0]; 

  const todayTimes = startTimes.filter(t => t.startsWith(todayStr));

  const upcomingTimes = todayTimes
    .map(t => new Date(t))
    .filter(t => t > now)
    .sort((a, b) => a.getTime() - b.getTime());

  if (upcomingTimes.length === 0) return null;

  const nextTime = upcomingTimes[0];
  const diff = nextTime.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { time: nextTime, hours, minutes, seconds };
  };

 // 카오스게이트/필드보스 시간 계산 (해당 날짜에만 1시간마다)
const getNextHourlyTime = (hasEventToday: boolean) => {
  if (!hasEventToday) return null;
  
  const now = currentTime;
  const nextHour = new Date(now);
  
  // 현재 분이 0분이면 다음 시간, 아니면 이번 시간 정각
  if (now.getMinutes() === 0 && now.getSeconds() === 0) {
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  } else {
    nextHour.setMinutes(0, 0, 0);
    if (nextHour <= now) {
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    }
  }
  
  const diff = nextHour.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { time: nextHour, hours, minutes, seconds };
};

// 적용
const nextBossTime = fieldBoss ? getNextHourlyTime(!!fieldBoss) : null;
const nextChaosTime = chaosGate ? getNextHourlyTime(!!chaosGate) : null;
const nextMountainTime = adventureIslands.length > 0
  ? getNextEventTime(adventureIslands.flatMap((island: any) => island.StartTimes))
  : null;

 

  return (
    <div className=" p-4">
      <div className="flex justify-center gap-4">
        {weekDays.map((date, i) => {
          const isToday = date.toISOString().split("T")[0] === todayStr;
          const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

          return (
            <div
              key={i}
              className={`flex flex-col mb-4 items-center rounded-lg px-4 py-2 ${
                isToday
                  ? "bg-purple-500 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <div className="text-sm">{dayNames[i]}</div>
              <div
                className={`text-xl font-bold ${i === 0 || i === 6 ? "text-red-400" : ""}`}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* 주요 일정 */}
      <div className="flex gap-4">
        {/* 모험섬 */}
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏝️</span>
              <span className="font-bold text-white">모험 섬</span>
            </div>
            {nextMountainTime ? (
              <div className="font-mono text-lg text-green-400 text-sm">
                {String(nextMountainTime.hours).padStart(2, "0")}:
                {String(nextMountainTime.minutes).padStart(2, "0")}:
                {String(nextMountainTime.seconds).padStart(2, "0")}
              </div>
            ) : (
              <span className="text-gray-400 font-bold text-sm">
                오늘은 없음
              </span>
            )}
          </div>
           
         
        </div>
        {/* 필드보스 */}
        <div className="flex-1 ">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              <span className="font-bold text-white">필드 보스</span>
            </div>
            {nextBossTime ? (
              <div className="font-mono text-lg text-purple-400 text-sm">
                {String(nextBossTime.hours).padStart(2, "0")}:
                {String(nextBossTime.minutes).padStart(2, "0")}:
                {String(nextBossTime.seconds).padStart(2, "0")}
              </div>
            ) : 
            <span className="text-gray-400 font-bold text-sm">
              오늘은 없음
            </span>
            }
          </div>
        </div>

        {/* 카오스게이트 */}
        <div className="flex-1 ">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌀</span>
              <span className="font-bold text-white">카오스게이트</span>
            </div>
             {nextChaosTime ? (
              <div className="font-mono text-lg text-purple-400 text-sm">
                {String(nextChaosTime.hours).padStart(2, "0")}:
                {String(nextChaosTime.minutes).padStart(2, "0")}:
                {String(nextChaosTime.seconds).padStart(2, "0")}
              </div>
            ) : 
            <span className="text-gray-400 font-bold text-sm">
              오늘은 없음
            </span>
            }
          </div>
          
        </div>
      </div>

      {/* 모험섬 상세 카드 */}
      {adventureIslands.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {adventureIslands.slice(0, 3).map((island: any, idx: number) => (
              <Card
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-all hover:border-slate-700"
              >
                <div className="flex gap-3 p-2">
                  {/* 아이콘 */}
                  <div className="flex justify-center">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <img
                        src={island.ContentsIcon}
                        alt={island.ContentsName}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* 섬 이름 */}
                    <div className="text-left text-sm font-bold text-white">
                      {island.ContentsName}
                    </div>

                    {island.RewardItems && island.RewardItems.length > 0 && (
                      <div className="flex gap-1">
                        {island.RewardItems[0].Items.slice(0, 6).map(
                          (item: any, i: number) => {
                            const gradeStyle =
                              GRADE_STYLES[
                                item.Grade as keyof typeof GRADE_STYLES
                              ] || GRADE_STYLES.전설;
                            return (
                              <div
                                key={i}
                                className={`relative flex h-8 w-8 rounded ${gradeStyle.bg} `}
                              >
                                <img
                                  src={item.Icon}
                                  alt={item.Name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
