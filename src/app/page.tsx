"use client";

import { Card } from "@/components/common/Card";
import { Bell, CalendarDays, FileText, TrendingUp } from "lucide-react";
import { EventSlider } from "@/components/ui/EventSlider";
import { TodaySchedule } from "@/components/news/TodaySchdule";
import { useEvents, useNotices } from "@/hooks/query/lostark/news/useNews";

import Loading from "./loading";
import FavoritesPage from "@/components/character/favorite/FavoritesPage";

export default function Home() {
  const { data: eventData, isLoading: eventLoading } = useEvents();
  const { data: noticeData, isLoading: noticeLoading } = useNotices();

  if (eventLoading || noticeLoading) return <Loading />;

  return (
    <div className="relative mx-auto max-w-[1400px] antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[10%] left-[15%] h-[600px] w-[600px] rounded-full bg-indigo-500/[0.08] blur-[120px]" />
        <div className="absolute right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[100px]" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-9">
          {eventData && (
            <div className="max-h-[400px] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
              <EventSlider events={eventData} />
            </div>
          )}

          <Card
            title="Live Schedule"
            icon={<CalendarDays size={18} className="text-indigo-400" />}
            headerAction={
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            }
          >
            <div className="p-2">
              <TodaySchedule />
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <NoticeSection
              title="Official Notice"
              data={noticeData
                ?.filter(
                  (n: any) => n.Type === "공지" && !n.Title.includes("업데이트")
                )
                .slice(0, 4)}
              icon={<Bell size={18} className="text-indigo-400" />}
            />
            <NoticeSection
              title="Patch Notes"
              data={noticeData
                ?.filter((n: any) => n.Title.includes("업데이트"))
                .slice(0, 4)}
              icon={<FileText size={18} className="text-blue-400" />}
            />
          </div>
        </div>

        <aside className="sticky top-29 h-fit space-y-8 lg:col-span-3">
          <FavoritesPage />

          <Card
            title="Market"
            icon={<TrendingUp size={16} className="text-emerald-400" />}
          >
            <div className="space-y-4 p-6">
              <MarketItem label="화폐거래소" price="2,840" change="+12" />
              <MarketItem label="명예의 파편" price="74" change="-2" />
              <MarketItem label="파괴강석" price="12" change="0" />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function NoticeSection({ title, data, icon }: any) {
  return (
    <Card title={title} icon={icon}>
      <div className="space-y-1 p-2">
        {data?.map((n: any, i: number) => (
          <a
            key={i}
            href={n.Link}
            target="_blank"
            className="group block rounded-2xl px-5 py-4 transition-all hover:bg-white/[0.05]"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[9px] font-bold tracking-tighter text-slate-600 uppercase">
                {new Date(n.Date).toLocaleDateString()}
              </span>
              <div className="h-0.5 w-0 bg-indigo-500 transition-all duration-300 group-hover:w-4" />
            </div>
            <p className="line-clamp-1 text-[13px] font-semibold tracking-tight text-slate-400 transition-colors group-hover:text-white">
              {n.Title}
            </p>
          </a>
        ))}
      </div>
    </Card>
  );
}

function MarketItem({ label, price, change }: any) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.03] pb-2 last:border-0">
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      <div className="flex items-center gap-3 font-mono text-[12px]">
        <span className="font-bold text-slate-200">{price}G</span>
        <span
          className={`text-[9px] ${change.includes("+") ? "text-rose-400" : "text-blue-400"}`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
