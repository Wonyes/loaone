"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyCard } from "../common/NoItems";
import { Card } from "../common/Card";
import { Sparkles, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Event {
  Link: string;
  Title: string;
  EndDate: string;
  Thumbnail: string;
  StartDate: string;
}

export const EventSlider = memo(function EventSlider({
  events,
}: {
  events?: Event[];
}) {
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
    <Card
      title="Event"
      icon={<Sparkles size={18} className="text-emerald-400" />}
      headerAction={
        <div className="flex items-center gap-2">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isAnimating && currentIndex !== idx) {
                  setIsAnimating(true);
                  setCurrentIndex(idx);
                }
              }}
              className="relative h-1.5 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: idx === currentIndex ? 24 : 8 }}
            >
              <div className="absolute inset-0 bg-white/20" />
              {idx === currentIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: "linear" }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </button>
          ))}
        </div>
      }
    >
      <div className="p-3">
        <div className="relative aspect-[21/10] w-full overflow-hidden rounded-2xl bg-black/50">
          <div className="absolute inset-0 z-0">
            <Image
              src={events[nextIndex].Thumbnail}
              alt="next"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <AnimatePresence
            initial={false}
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={currentIndex}
              initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0 z-10"
            >
              <a
                href={events[currentIndex].Link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full w-full"
              >
                <Image
                  src={events[currentIndex].Thumbnail}
                  alt={events[currentIndex].Title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                </div>
              </a>
            </motion.div>
          </AnimatePresence>

          {/* 이벤트 정보 - 이미지 하단 */}
          <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
                    {new Date(
                      events[currentIndex].StartDate
                    ).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                    &nbsp;~&nbsp;
                    {new Date(events[currentIndex].EndDate).toLocaleDateString(
                      "ko-KR",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                    까지
                  </span>
                </div>
                <h3 className="line-clamp-1 text-base font-bold text-white drop-shadow-lg">
                  {events[currentIndex].Title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
});
