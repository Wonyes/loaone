"use client";

import {
  useFavoriteStatus,
  useToggleFavorite,
} from "@/hooks/query/lostark/character/useFavorite";
import { useUser } from "@/hooks/useUesr";
import { signInWithDiscord } from "@/lib/supabase/discode/discode";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";

export default function FavoriteButton({
  characterName,
  profileData,
}: {
  profileData: any;
  characterName: string;
}) {
  const { user, loading } = useUser();
  const { data, isLoading } = useFavoriteStatus(characterName);
  const toggle = useToggleFavorite(characterName);

  const showAlert = useNoticeStore(state => state.showAlert);

  const handleLogin = async () => {
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleClick = () => {
    if (!user) {
      showAlert(
        "로그인이 필요합니다.",
        "즐겨찾기를 하려면 로그인이 필요합니다.",
        "디스코드로 로그인하기",
        handleLogin
      );
      return;
    }

    toggle.mutate(
      {
        characterName,
        serverName: profileData?.ServerName,
        itemLevel: profileData?.ItemAvgLevel,
        className: profileData?.CharacterClassName,
      },
      {
        onSuccess: data => {
          if (data.favorited) {
          } else {
          }
        },
        onError: error => {
          showAlert(
            "오류 발생",
            "즐겨찾기 처리 중 오류가 발생했습니다.",
            "확인"
          );
          console.error("Toggle error:", error);
        },
      }
    );
  };

  if (!user) return null;
  if (loading || isLoading) return <Loading />;

  return (
    <>
      <button
        onClick={handleClick}
        className="group absolute top-3 right-3 z-99 transition-all active:scale-75"
      >
        <div className="absolute inset-0 -z-10 scale-0 rounded-full bg-yellow-400/20 blur-xl transition-transform duration-500 group-hover:scale-150" />
        <Star
          className={cn(
            "h-9 w-9 cursor-pointer transition-all duration-300",
            data?.favorited && user
              ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]"
              : "text-gray-500 group-hover:text-gray-200"
          )}
        />
      </button>
    </>
  );
}
