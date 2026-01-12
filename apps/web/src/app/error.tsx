"use client";

import { Home, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function ErrorContent() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 backdrop-blur-md"></div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-8 flex h-40 items-end justify-center gap-5">
          <div className="relative flex flex-col items-center">
            <div className="animate-[wilting_2s_ease-in-out_infinite] text-6xl opacity-70">
              🌿
            </div>
            <div className="mt-2 h-3 w-12 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-[wilting_2s_ease-in-out_infinite] text-7xl opacity-80"
              style={{ animationDelay: "0.3s" }}
            >
              🍃
            </div>
            <div className="mt-2 h-3 w-14 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-[wilting_2s_ease-in-out_infinite] text-6xl opacity-70"
              style={{ animationDelay: "0.6s" }}
            >
              🌱
            </div>
            <div className="mt-2 h-3 w-12 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative mb-6">
            <h1 className="animate-pulse bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-7xl leading-none font-black text-transparent">
              ERROR
            </h1>
            <div className="absolute inset-0 opacity-30 blur-2xl">
              <h1 className="text-7xl leading-none font-black text-emerald-500">
                ERROR
              </h1>
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">
            모코코가 길을 잃었어요!
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-gray-300">
            일시적인 오류가 발생했습니다.
            <br />
            모코코를 찾는 동안 잠시만 기다려주세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => (window.location.href = "/")}
            className="group relative overflow-hidden rounded-lg border-t-2 border-emerald-400/50 bg-gradient-to-b from-emerald-500 to-emerald-700 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <span className="relative flex items-center gap-2 drop-shadow-lg">
              <Home className="h-5 w-5" />
              마을로 귀환
            </span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-lg border-t-2 border-slate-500/50 bg-gradient-to-b from-slate-700 to-slate-800 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-slate-600 hover:to-slate-700"
          >
            <RefreshCw className="h-5 w-5" />
            다시 시도
          </button>
        </div>

        <div className="absolute top-20 left-20 h-4 w-4 animate-[float_4s_ease-in-out_infinite] rounded-full bg-emerald-400/60 blur-sm"></div>
        <div
          className="absolute top-40 right-32 h-3 w-3 animate-[float_5s_ease-in-out_infinite] rounded-full bg-green-400/50 blur-sm"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-40 h-5 w-5 animate-[float_6s_ease-in-out_infinite] rounded-full bg-emerald-500/40 blur-sm"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute right-20 bottom-20 h-4 w-4 animate-[float_5.5s_ease-in-out_infinite] rounded-full bg-lime-500/50 blur-sm"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald-600/5 blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes wilting {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(10px) rotate(-3deg);
            opacity: 0.3;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

export default function ErrorCompo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(<ErrorContent />, document.body);
}
