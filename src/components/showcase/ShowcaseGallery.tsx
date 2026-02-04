"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useShowcaseGallery } from "@/hooks/query/showcase";
import { ShowcaseSortOption } from "@/types/showcase";
import ShowcaseCard from "./ShowcaseCard";
import ShowcaseCardSkeleton from "./ShowcaseCardSkeleton";
import { Flame, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShowcaseGallery() {
  const [sort, setSort] = useState<ShowcaseSortOption>("latest");
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useShowcaseGallery(sort);

  const observerRef = useRef<IntersectionObserver>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const showcases = data?.pages.flatMap((page) => page.showcases) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SortButton
          active={sort === "latest"}
          onClick={() => setSort("latest")}
          icon={<Clock className="h-3.5 w-3.5" />}
          label="최신순"
        />
        <SortButton
          active={sort === "popular"}
          onClick={() => setSort("popular")}
          icon={<Flame className="h-3.5 w-3.5" />}
          label="인기순"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ShowcaseCardSkeleton key={i} />
          ))}
        </div>
      ) : showcases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-20">
          <p className="text-gray-400">아직 등록된 아바타가 없습니다</p>
          <p className="mt-1 text-sm text-gray-500">
            첫 번째로 아바타를 등록해보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {showcases.map((showcase) => (
              <ShowcaseCard key={showcase.id} showcase={showcase} />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SortButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all",
        active
          ? "bg-indigo-600 text-white"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
