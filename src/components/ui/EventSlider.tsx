"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyCard } from "../common/NoItems";
import { Star } from "lucide-react";

interface Event {
  Link: string;
  Title: string;
  EndDate: string;
  Thumbnail: string;
  StartDate: string;
}

export function EventSlider({ events }: { events?: Event[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating || !events || events.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % events.length);
  }, [isAnimating, events]);

  useEffect(() => {
    if (!events || events.length <= 1) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [events, handleNext]);

  if (!events || events.length === 0) {
    return <EmptyCard message="진행 중인 이벤트가 없습니다" />;
  }

  const nextIndex = (currentIndex + 1) % events.length;

  return (
    <div className="group relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]">
      <div className="absolute inset-0 z-0">
        <img
          src={events[nextIndex].Thumbnail}
          alt="next"
          className="h-full w-full object-cover opacity-60"
        />
      </div>

      <AnimatePresence
        initial={false}
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={currentIndex}
          initial={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 0% 100%)",
            opacity: 1,
            zIndex: 20,
          }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0 z-10"
        >
          <a
            href={events[currentIndex].Link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            <img
              src={events[currentIndex].Thumbnail}
              alt={events[currentIndex].Title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </a>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-4 left-2 z-30">
        <motion.div
          key={`text-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 rounded-full px-3 py-2">
            <div className="flex items-center gap-1">
              <Star className={`h-4 w-4 fill-yellow-400 text-yellow-400`} />
              <h2 className="text-xs text-yellow-400">진행중인 이벤트</h2>
            </div>
            <h2 className="font-bold tracking-tight text-white drop-shadow-md">
              {events[currentIndex].Title}
            </h2>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-8 bottom-8 z-30 flex items-center gap-1.5">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isAnimating && currentIndex !== idx) {
                setIsAnimating(true);
                setCurrentIndex(idx);
              }
            }}
            className="group/btn relative h-6 w-1"
          >
            <div
              className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? "h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "h-1.5 bg-white/20 group-hover/btn:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
