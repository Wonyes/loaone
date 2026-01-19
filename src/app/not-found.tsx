"use client";

import { AlertTriangle, Home, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-6">
      <div className="relative w-full max-w-2xl py-12 text-center">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-amber-500/5 blur-[80px]"></div>
          <div className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-blue-500/5 blur-[80px]"></div>
        </div>

        <div className="relative mb-6">
          <h1 className="bg-gradient-to-b from-amber-400 to-amber-600 bg-clip-text text-7xl leading-none font-black text-transparent sm:text-8xl md:text-9xl">
            404
          </h1>
          <div className="pointer-events-none absolute inset-0 opacity-20 blur-2xl select-none">
            <h1 className="text-7xl leading-none font-black text-amber-500 sm:text-8xl md:text-9xl">
              404
            </h1>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center gap-2">
          <AlertTriangle className="mb-2 h-10 w-10 text-amber-500" />

          <p className="max-w-xs text-sm text-gray-400 sm:max-w-md sm:text-base">
            요청하신 페이지는 아크라시아 지도에 존재하지 않는 구역입니다.
            <br />
            주소를 다시 확인하거나 아래 버튼으로 이동하세요.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-gray-300 transition-all hover:bg-slate-700 hover:text-white sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            이전 구역으로
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-t border-emerald-400/50 bg-gradient-to-b from-emerald-500/80 to-emerald-700/80 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            마을로 귀환
          </button>
        </div>
      </div>
    </div>
  );
}
