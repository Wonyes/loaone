"use client";

import { Home, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function ErrorCompo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden rounded-3xl px-4 py-12">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-32 items-end justify-center gap-3 sm:h-40 sm:gap-5">
          <div className="relative flex flex-col items-center">
            <div className="animate-[wilting_2s_ease-in-out_infinite] text-4xl opacity-70 sm:text-6xl">
              🌿
            </div>
            <div className="mt-2 h-2 w-10 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-[wilting_2s_ease-in-out_infinite] text-5xl opacity-80 sm:text-7xl"
              style={{ animationDelay: "0.3s" }}
            >
              🍃
            </div>
            <div className="mt-2 h-2 w-12 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-[wilting_2s_ease-in-out_infinite] text-4xl opacity-70 sm:text-6xl"
              style={{ animationDelay: "0.6s" }}
            >
              🌱
            </div>
            <div className="mt-2 h-2 w-10 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative mb-4">
            <h1 className="animate-pulse bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-5xl leading-none font-black text-transparent sm:text-7xl">
              ERROR
            </h1>
            <div className="pointer-events-none absolute inset-0 opacity-20 blur-2xl select-none">
              <h1 className="text-5xl leading-none font-black text-emerald-500 sm:text-7xl">
                ERROR
              </h1>
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            모코코가 길을 잃었어요!
          </h2>
          <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-gray-400 sm:max-w-md sm:text-lg">
            일시적인 오류가 발생했습니다.
            <br className="hidden sm:block" />
            모코코를 찾는 동안 잠시만 기다려주세요.
          </p>
        </div>

        {/* 버튼 그룹 (반응형 대응) */}
        <div className="flex w-full max-w-[280px] flex-col gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border-t border-emerald-400/50 bg-gradient-to-b from-emerald-500 to-emerald-700 px-8 py-3.5 font-bold text-white transition-all hover:scale-105 active:scale-95"
          >
            <Home className="h-5 w-5" />
            <span>마을로 귀환</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-lg border-t border-slate-500/50 bg-gradient-to-b from-slate-700 to-slate-800 px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:from-slate-600 hover:to-slate-700 active:scale-95"
          >
            <RefreshCw className="h-5 w-5" />
            다시 시도
          </button>
        </div>

        {/* 배경 부유 입자 (컴포넌트 내부에 가둠) */}
        <div className="pointer-events-none absolute top-10 left-10 h-3 w-3 animate-[float_4s_ease-in-out_infinite] rounded-full bg-emerald-400/40 blur-sm"></div>
        <div
          className="pointer-events-none absolute top-20 right-10 h-2 w-2 animate-[float_5s_ease-in-out_infinite] rounded-full bg-green-400/30 blur-sm"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="pointer-events-none absolute bottom-10 left-20 h-4 w-4 animate-[float_6s_ease-in-out_infinite] rounded-full bg-emerald-500/30 blur-sm"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* 중앙 글로우 효과 */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald-600/5 blur-[100px] sm:h-[500px] sm:w-[500px]"></div>
      </div>

      <style jsx>{`
        @keyframes wilting {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            filter: grayscale(0);
          }
          50% {
            transform: translateY(8px) rotate(-5deg);
            filter: grayscale(0.4);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
