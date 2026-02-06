"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useUser } from "@/hooks/useUesr";
import { useToggleShowcaseLike } from "@/hooks/query/showcase";
import { useShowcaseLikeStore } from "@/hooks/store/useShowcaseLikeStore";
import { signInWithDiscord } from "@/lib/supabase/discode/discode";
import { cn } from "@/lib/utils";

interface ShowcaseLikeButtonProps {
  showcaseId: string;
  showcaseUserId?: string;
  likeCount: number;
  isLiked: boolean;
}

export default function ShowcaseLikeButton({
  showcaseId,
  showcaseUserId,
  likeCount,
  isLiked,
}: ShowcaseLikeButtonProps) {
  const { user } = useUser();
  const toggleLike = useToggleShowcaseLike(showcaseId);
  const { init, toggle, likes } = useShowcaseLikeStore();

  const entry = likes[showcaseId];

  // 서버 데이터로 스토어 초기화
  useEffect(() => {
    init(showcaseId, likeCount, isLiked);
  }, [showcaseId, likeCount, isLiked, init]);

  const currentLiked = entry?.liked ?? isLiked;
  const currentCount = entry?.count ?? likeCount;

  const isOwner = !!user && !!showcaseUserId && user.id === showcaseUserId;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOwner) return;
    if (!user) {
      await signInWithDiscord();
      return;
    }
    // Zustand 즉시 반영
    toggle(showcaseId);
    // 서버 동기화
    toggleLike.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggleLike.isPending || isOwner}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
        isOwner
          ? "cursor-default bg-white/5 text-gray-500"
          : currentLiked
            ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-rose-400"
      )}
    >
      <Heart
        className={cn("h-3.5 w-3.5", currentLiked && "fill-rose-400")}
      />
      <span>{currentCount}</span>
    </button>
  );
}
