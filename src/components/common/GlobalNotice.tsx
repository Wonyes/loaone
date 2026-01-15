"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";
import { LogIn, CheckCircle } from "lucide-react";

export function GlobalNotice() {
  const {
    toastOpen,
    toastMessage,
    alertOpen,
    alertTitle,
    alertMessage,
    confirmLabel,
    onConfirm,
    hideAlert,
  } = useNoticeStore();

  return (
    <AnimatePresence>
      {/* 1. 토스트  */}
      {toastOpen === null || toastOpen === false
        ? undefined
        : toastOpen && (
            <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4">
              {/* 배경 딤드 처리 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto absolute inset-0 bg-black/40"
              />

              {/* 토스트 본체 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto relative flex flex-col items-center gap-4 overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-[#0c0d12]/95 px-10 py-8 shadow-[0_0_80px_rgba(16,185,129,0.3)]"
              >
                {/* 상단 빛나는 아이콘 */}
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse bg-emerald-500 opacity-40 blur-xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                </div>

                {/* 텍스트 정보 */}
                <div className="text-center">
                  <span className="text-lg font-black tracking-[0.2em] text-white uppercase italic drop-shadow-lg">
                    {toastMessage}
                  </span>
                  <p className="mt-1 text-[10px] font-bold tracking-widest text-emerald-500/60 uppercase">
                    System Process Completed
                  </p>
                </div>

                {/* 하단 장식 라인 */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              </motion.div>
            </div>
          )}

      {/* 2. 얼럿  */}
      {alertOpen === null || alertOpen === false
        ? undefined
        : alertOpen && (
            <div className="pointer-events-none fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-24">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto fixed inset-0 bg-black/60"
                onClick={hideAlert}
              />

              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                className="pointer-events-auto relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12]/95 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <LogIn className="h-6 w-6 text-violet-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-black tracking-widest text-white uppercase italic">
                        {alertTitle}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed font-medium text-gray-400">
                        {alertMessage}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      className="flex-1 rounded-xl bg-violet-600 py-3 text-[11px] font-black text-white shadow-lg shadow-violet-900/20 transition-all hover:bg-violet-500 active:scale-95"
                      onClick={() => {
                        onConfirm?.();
                        hideAlert();
                      }}
                    >
                      {confirmLabel}
                    </button>
                    <button
                      className="rounded-xl border border-white/5 bg-white/5 px-5 py-3 text-[11px] font-bold text-gray-400 transition-all hover:text-white"
                      onClick={hideAlert}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
    </AnimatePresence>
  );
}
