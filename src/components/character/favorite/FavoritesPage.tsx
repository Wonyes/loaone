"use client";

import { useFavorites } from "@/hooks/query/lostark/character/useFavorite";
import Link from "next/link";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUesr";
import { Card } from "@/components/common/Card";
import { FavoritesSkeleton } from "@/components/common/CardSkeleton";

export default function FavoritesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { data: favorites = [], isLoading } = useFavorites();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <FavoritesSkeleton />;
  }

  return (
    <Card
      title="Favorites"
      icon={<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
    >
      <div className="p-2">
        {!user ? (
          <div className="py-10 text-center text-[12px] text-slate-300">
            로그인 후 이용가능합니다 !
          </div>
        ) : favorites.length === 0 ? (
          <div className="py-12 text-center text-[12px] font-bold tracking-widest text-slate-300">
            즐겨찾기한 캐릭터가 없습니다 !
          </div>
        ) : (
          <div className="no-scrollbar max-h-[400px] space-y-1 overflow-y-auto">
            {favorites.map((char: any) => (
              <FavoriteCharacter key={char.name} char={char} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function FavoriteCharacter({ char }: { char: any }) {
  return (
    <Link
      href={`/characters/${char.name}`}
      className="group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all hover:bg-white/[0.05]"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-[13px] font-bold text-slate-200 transition-colors group-hover:text-indigo-400">
          {char.name}
        </span>
        <span className="truncate text-[10px] text-slate-600">
          {char.className}
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5 font-mono">
        <span className="text-[11px] font-black tracking-tighter text-indigo-400/90">
          <span className="mr-0.5 text-[9px] italic opacity-30">Lv</span>
          {char.itemLevel}
        </span>
        <div className="h-px w-2 bg-white/10 transition-all group-hover:w-6 group-hover:bg-indigo-500/50" />
      </div>
    </Link>
  );
}
