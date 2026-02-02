"use client";

import { Heart } from "lucide-react";
import { useUser } from "@/hooks/useUesr";
import { useToggleShowcaseLike } from "@/hooks/query/showcase";
import { signInWithDiscord } from "@/lib/supabase/discode/discode";
import { cn } from "@/lib/utils";

interface ShowcaseLikeButtonProps {
  showcaseId: string;
  likeCount: number;
  isLiked: boolean;
}

export default function ShowcaseLikeButton({
  showcaseId,
  likeCount,
  isLiked,
}: ShowcaseLikeButtonProps) {
  const { user } = useUser();
  const toggleLike = useToggleShowcaseLike(showcaseId);

  const handleClick = async () => {
    if (!user) {
      await signInWithDiscord();
      return;
    }
    toggleLike.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggleLike.isPending}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
        isLiked
          ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-rose-400"
      )}
    >
      <Heart
        className={cn("h-3.5 w-3.5", isLiked && "fill-rose-400")}
      />
      <span>{likeCount}</span>
    </button>
  );
}
