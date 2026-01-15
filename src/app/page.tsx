"use client";

import { Card } from "@/components/common/Card";
import { EmptyCard } from "@/components/common/NoItems";
import { TodaySchedule } from "@/components/news/TodaySchdule";
import { EventSlider } from "@/components/ui/EventSlider";
import { useEvents, useNotices } from "@/hooks/query/lostark/news/useNews";
import { useFavoriteStore } from "@/hooks/store/useFavoriteStore";
import { Star, ChevronRight, Bell, FileText, CalendarDays } from "lucide-react";
import Link from "next/link";
import Loading from "./loading";
import { useUser } from "@/hooks/useUesr";

export default function Home() {
  const { user } = useUser();
  const { data: eventData, isLoading: eventLoading } = useEvents();
  const { data: noticeData, isLoading: noticeLoading } = useNotices();
  const favorites = useFavoriteStore(state => state.favorites);

  const isLoading = eventLoading || noticeLoading;

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-9 xl:col-span-9">
          {eventData === null ? undefined : (
            <Card className="overflow-hidden">
              <EventSlider events={eventData} />
            </Card>
          )}

          <Card
            title="오늘의 일정"
            icon={
              <div className="rounded-lg bg-violet-500/10 p-2">
                <CalendarDays size={18} className="text-red-400" />
              </div>
            }
            className="overflow-hidden"
          >
            <TodaySchedule />
          </Card>

          {noticeData === null ? undefined : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card
                title="공지사항"
                icon={
                  <div className="rounded-lg bg-indigo-500/10 p-2">
                    <Bell className="h-5 w-5 text-indigo-400" />
                  </div>
                }
                className="overflow-hidden"
              >
                {noticeData.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {noticeData
                      .filter(
                        (notice: any) =>
                          notice.Type === "공지" &&
                          !notice.Title.includes("업데이트")
                      )
                      .slice(0, 4)
                      .map((notice: any, idx: number) => (
                        <NoticeItem key={idx} notice={notice} type="공지" />
                      ))}
                  </div>
                ) : (
                  <EmptyCard message="공지사항이 없습니다." />
                )}
              </Card>

              <Card
                title="패치노트"
                icon={
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                }
                className="overflow-hidden"
              >
                {noticeData.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {noticeData
                      .filter((notice: any) =>
                        notice.Title.includes("업데이트")
                      )
                      .slice(0, 4)
                      .map((notice: any, idx: number) => (
                        <NoticeItem key={idx} notice={notice} type="업데이트" />
                      ))}
                  </div>
                ) : (
                  <EmptyCard message="패치노트가 없습니다." />
                )}
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-3 xl:col-span-3">
          <Card
            icon={<Star className="h-4 w-4 text-yellow-400" />}
            title="즐겨찾기"
            className="sticky top-26 overflow-hidden"
          >
            {user === null ? (
              <EmptyCard
                className="border-none"
                message="로그인 후 즐겨찾기를 확인하세요!"
              />
            ) : favorites.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-slate-800/50 p-6">
                    <Star className="h-12 w-12 text-slate-700" />
                  </div>
                </div>
                <p className="mb-1 text-sm font-semibold text-white">
                  즐겨찾기가 비어있어요
                </p>
                <p className="text-xs text-slate-500">캐릭터를 추가해보세요</p>
              </div>
            ) : (
              <div className="max-h-[600px] space-y-2 overflow-y-auto p-4">
                {favorites.map(char => (
                  <FavoriteCharacter key={char.name} char={char} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function NoticeItem({ notice, type }: { notice: any; type: string }) {
  const isNotice = type === "공지";
  return (
    <a
      href={notice.Link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-white/5 bg-gradient-to-r from-white/5 to-transparent px-4 py-2 transition-all hover:border-blue-500/30 hover:from-blue-500/10"
    >
      <p
        className={`inline-block rounded-md ${isNotice ? "bg-indigo-500/20 text-indigo-400" : "bg-blue-500/20 text-blue-400"} px-2.5 py-1 text-xs font-bold`}
      >
        {type}
      </p>
      <p className="my-1 line-clamp-2 truncate text-sm leading-relaxed font-medium text-white">
        {notice.Title}
      </p>
      <p className="text-xs text-slate-500">
        {new Date(notice.Date).toLocaleDateString("ko-KR")}
      </p>
    </a>
  );
}

function FavoriteCharacter({ char }: { char: any }) {
  return (
    <Link
      href={`/characters/${char.name}`}
      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-gradient-to-r from-white/5 to-transparent p-4 transition-all hover:border-yellow-500/30 hover:from-yellow-500/10"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-white">{char.name}</p>
          {char.className && (
            <>
              <span className="text-slate-600">·</span>
              <p className="truncate text-xs text-slate-400">
                {char.className}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500">{char.serverName}</span>
          <span className="text-slate-700">·</span>
          <span className="font-semibold text-indigo-400">
            Lv.{char.itemLevel}
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-yellow-400" />
    </Link>
  );
}
