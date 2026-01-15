"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function LoadingContent() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative mb-8 flex h-32 items-end justify-center gap-5">
          <div className="relative flex flex-col items-center">
            <div
              className="animate-bounce text-6xl"
              style={{ animationDelay: "0s", animationDuration: "1s" }}
            >
              🌿
            </div>
            <div
              className="mt-2 h-3 w-12 animate-pulse rounded-full bg-black/30 blur-sm"
              style={{ animationDelay: "0s" }}
            ></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-bounce text-6xl"
              style={{ animationDelay: "0.2s", animationDuration: "1s" }}
            >
              🌱
            </div>
            <div
              className="mt-2 h-3 w-12 animate-pulse rounded-full bg-black/30 blur-sm"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-bounce text-6xl"
              style={{ animationDelay: "0.4s", animationDuration: "1s" }}
            >
              🍃
            </div>
            <div
              className="mt-2 h-3 w-12 animate-pulse rounded-full bg-black/30 blur-sm"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <div className="relative flex flex-col items-center">
            <div
              className="animate-bounce text-6xl"
              style={{ animationDelay: "0.6s", animationDuration: "1s" }}
            >
              🌿
            </div>
            <div
              className="mt-2 h-3 w-12 animate-pulse rounded-full bg-black/30 blur-sm"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="mb-2 flex items-center justify-center gap-1 text-3xl font-bold text-white">
            <span className="animate-pulse">불러오는 중</span>
            <span
              className="animate-[pulse_1s_ease-in-out_infinite]"
              style={{ animationDelay: "0s" }}
            >
              .
            </span>
            <span
              className="animate-[pulse_1s_ease-in-out_infinite]"
              style={{ animationDelay: "0.2s" }}
            >
              .
            </span>
            <span
              className="animate-[pulse_1s_ease-in-out_infinite]"
              style={{ animationDelay: "0.4s" }}
            >
              .
            </span>
          </h2>
          <p className="text-gray-300">잠시만 기다려주세요!</p>
        </div>

        <div className="h-3 w-80 max-w-[90vw] overflow-hidden rounded-full border border-amber-500/30 bg-slate-800/80">
          <div className="h-full animate-[progress_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-green-400 via-amber-400 to-green-400"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(<LoadingContent />, document.body);
}
