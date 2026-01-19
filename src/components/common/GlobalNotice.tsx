"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";
import { LogIn, CheckCircle } from "lucide-react";

export function GlobalNotice() {
  const toastOpen = useNoticeStore(state => state.toastOpen);
  const toastMessage = useNoticeStore(state => state.toastMessage);
  const alertOpen = useNoticeStore(state => state.alertOpen);
  const alertTitle = useNoticeStore(state => state.alertTitle);
  const alertMessage = useNoticeStore(state => state.alertMessage);
  const confirmLabel = useNoticeStore(state => state.confirmLabel);
  const onConfirm = useNoticeStore(state => state.onConfirm);
  const hideAlert = useNoticeStore(state => state.hideAlert);

  return (
    <AnimatePresence>
      {toastOpen && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto fixed inset-0 bg-black/40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative flex flex-col items-center gap-4 overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-[#0c0d12]/95 px-12 py-10 shadow-[0_0_80px_rgba(16,185,129,0.3)]"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-emerald-500 opacity-40 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase italic drop-shadow-lg">
                {toastMessage}
              </h2>
              <p className="mt-2 text-[11px] font-bold tracking-[0.3em] text-emerald-500/60 uppercase">
                Process Completed
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          </motion.div>
        </div>
      )}

      {alertOpen && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={hideAlert}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
            className="pointer-events-auto relative w-full max-w-[400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0d12] shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
          >
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                  <LogIn className="h-8 w-8 text-violet-400" />
                </div>
                <h3 className="text-lg font-black tracking-widest text-white uppercase italic">
                  {alertTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed font-medium text-gray-400">
                  {alertMessage}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  className="w-full rounded-2xl bg-violet-600 py-4 text-xs font-black text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-50 hover:text-violet-900 active:scale-95"
                  onClick={() => {
                    onConfirm?.();
                    hideAlert();
                  }}
                >
                  {confirmLabel}
                </button>
                <button
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 text-xs font-bold text-gray-500 transition-all hover:bg-white/10 hover:text-white"
                  onClick={hideAlert}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
