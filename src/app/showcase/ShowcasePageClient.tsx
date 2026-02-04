"use client";

import { useUser } from "@/hooks/useUesr";
import ShowcaseGallery from "@/components/showcase/ShowcaseGallery";
import Link from "next/link";
import { Sparkles, Plus, Settings } from "lucide-react";
import { useMyShowcases } from "@/hooks/query/showcase";

export default function ShowcasePageClient() {
  const { user } = useUser();
  const { data: myShowcase } = useMyShowcases();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              SHOWCASE
            </h1>
            <p className="text-sm text-gray-400">
              로스트아크 유저들의 아바타 갤러리
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {user && myShowcase ? (
            <Link
              href="/showcase/register"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4" />내 캐릭터 관리
            </Link>
          ) : (
            <Link
              href="/showcase/register"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-purple-500"
            >
              <Plus className="h-4 w-4" />내 캐릭터 등록하기
            </Link>
          )}
        </div>
      </div>

      <ShowcaseGallery />
    </div>
  );
}
