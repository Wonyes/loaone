"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUesr";
import { useProfile } from "@/hooks/query/lostark/character/useLostarkApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/common/Card";
import { AvatarShowcase } from "@/types/showcase";
import { Trash2 } from "lucide-react";
import { Crown, Flame, Shield, MapPin, UserPen, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CharacterListLayout } from "@/components/character/CharacterList";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const mainCharacter = user?.user_metadata?.main_character || "";
  const { data: profileData, isLoading: profileLoading } =
    useProfile(mainCharacter);

  const [showcases, setShowcases] = useState<AvatarShowcase[]>([]);
  const [showcaseLoading, setShowcaseLoading] = useState(true);

  const fetchShowcases = () => {
    if (!user) return;
    fetch("/api/showcase")
      .then(res => res.json())
      .then(data => setShowcases(data.showcases ?? []))
      .catch(() => setShowcases([]))
      .finally(() => setShowcaseLoading(false));
  };

  useEffect(() => {
    fetchShowcases();
  }, [user]);

  const handleDeleteShowcase = async (id: string) => {
    const res = await fetch(`/api/showcase/${id}`, { method: "DELETE" });
    if (res.ok) {
      setShowcases(prev => prev.filter(s => s.id !== id));
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  const avatarUrl = user.user_metadata.avatar_url;
  const username =
    user.user_metadata.custom_claims?.global_name ||
    user.user_metadata.full_name ||
    "User";

  console.log(profileData);
  const SPECIALIST_CLASSES = ["환수사", "기상술사", "도화가"];

  return (
    <div className="mx-auto max-w-[800px] space-y-4">
      {/* 상단: 유저 정보 카드 */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-5 p-6">
          <Avatar className="h-20 w-20 border-2 border-white/10">
            <AvatarImage src={avatarUrl} alt={username} />
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-lg font-black tracking-tight text-white">
              {username}
            </h1>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2">
              {mainCharacter ? (
                <span className="text-sm font-bold text-teal-400">
                  {mainCharacter}
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  대표 캐릭터 미설정
                </span>
              )}
              <Link
                href="/setup-character"
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300 transition-colors hover:bg-white/10"
              >
                <UserPen className="h-3 w-3" />
                변경
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* 중단: 대표 캐릭터 상세 */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.05] px-6 py-3">
          <h2 className="text-[13px] font-black tracking-[0.2em] text-white/90 uppercase">
            대표 캐릭터
          </h2>
        </div>

        {!mainCharacter ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-slate-400">
              대표 캐릭터가 설정되지 않았습니다.
            </p>
            <Link
              href="/setup-character"
              className="rounded-xl border border-teal-500/30 bg-teal-600/20 px-4 py-2 text-xs font-bold text-teal-300 transition-all hover:bg-teal-600/30"
            >
              대표 캐릭터 설정하기
            </Link>
          </div>
        ) : profileLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          </div>
        ) : !profileData ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-slate-400">
              캐릭터 정보를 불러올 수 없습니다.
            </p>
          </div>
        ) : (
          <div className="relative min-h-[260px]">
            {/* 캐릭터 이미지 배경 */}
            {profileData.CharacterImage && (
              <div className="absolute inset-y-0 right-0 z-0 w-[55%] overflow-hidden">
                <img
                  src={profileData.CharacterImage}
                  alt={profileData.CharacterName}
                  className={cn(
                    "h-full w-full object-cover object-[50%_15%]",
                    SPECIALIST_CLASSES.includes(
                      profileData.CharacterClassName
                    ) && "object-[50%_35%]"
                  )}
                  style={{
                    maskImage:
                      "linear-gradient(to left, black 70%, transparent 95%), linear-gradient(to top, transparent 1%, black 20%)",
                    WebkitMaskImage:
                      "linear-gradient(to left, black 70%, transparent 95%), linear-gradient(to top, transparent 1%, black 20%)",
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                  }}
                />
              </div>
            )}

            {/* 캐릭터 정보 */}
            <div className="relative z-10 space-y-5 p-6">
              {/* 뱃지 */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black tracking-tight text-gray-400 uppercase">
                  {profileData.ServerName}
                </span>
                <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-black tracking-tight text-purple-300 uppercase italic">
                  {profileData.CharacterClassName}
                </span>
              </div>

              {/* 이름 */}
              <h3 className="text-2xl font-black tracking-tighter text-white italic sm:text-3xl">
                {profileData.CharacterName}
              </h3>

              {/* 스탯 칩 */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-2">
                  <Crown className="h-4 w-4 text-violet-400 opacity-70" />
                  <div className="flex flex-col">
                    <span className="mb-0.5 text-[10px] font-black tracking-widest text-violet-400/40">
                      Item Level
                    </span>
                    <span className="font-mono text-lg font-black tracking-tighter text-violet-400">
                      {profileData.ItemAvgLevel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2">
                  <Flame className="h-4 w-4 text-red-400 opacity-70" />
                  <div className="flex flex-col">
                    <span className="mb-0.5 text-[10px] font-black tracking-widest text-red-400/40">
                      Combat Power
                    </span>
                    <span className="font-mono text-lg font-black tracking-tighter text-red-400">
                      {profileData?.CombatPower?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.03] bg-white/[0.07] px-3 py-2">
                  <Shield size={13} className="text-emerald-500 opacity-50" />
                  <div className="flex flex-col">
                    <span className="mb-0.5 text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">
                      Guild
                    </span>
                    <span className="text-[13px] font-bold text-slate-300">
                      {profileData.GuildName || "—"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.03] bg-white/[0.07] px-3 py-2">
                  <MapPin size={13} className="text-slate-400 opacity-50" />
                  <div className="flex flex-col">
                    <span className="mb-0.5 text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">
                      Town
                    </span>
                    <span className="text-[13px] font-bold text-slate-300">
                      {profileData.TownName
                        ? `Lv.${profileData.TownLevel}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 하단: 활동 내역 */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.05] px-6 py-3">
          <h2 className="text-[13px] font-black tracking-[0.2em] text-white/90 uppercase">
            활동 내역
          </h2>
        </div>

        {showcaseLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          </div>
        ) : showcases.length > 0 ? (
          <div className="space-y-2 p-4">
            {showcases.map(sc => (
              <div
                key={sc.id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10">
                  <ImageIcon className="h-5 w-5 text-teal-400" />
                </div>
                <Link
                  href={`/showcase/${sc.id}`}
                  className="min-w-0 flex-1 space-y-0.5 hover:opacity-80"
                >
                  <p className="text-sm font-bold text-white">
                    {sc.character_name}
                  </p>
                  {sc.description && (
                    <p className="truncate text-xs text-slate-400">
                      {sc.description}
                    </p>
                  )}
                </Link>
                <button
                  onClick={() => handleDeleteShowcase(sc.id)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Link
              href="/showcase/register"
              className="mt-2 flex w-full items-center justify-center rounded-xl border border-dashed border-white/10 py-3 text-xs font-bold text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              + 새 아바타 자랑 등록
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-slate-400">
              아바타 자랑이 등록되지 않았습니다.
            </p>
            <Link
              href="/showcase/register"
              className="rounded-xl border border-teal-500/30 bg-teal-600/20 px-4 py-2 text-xs font-bold text-teal-300 transition-all hover:bg-teal-600/30"
            >
              아바타 자랑 등록하기
            </Link>
          </div>
        )}
      </Card>
      <Card title="내 캐릭터">
        <CharacterListLayout name={mainCharacter} />
      </Card>
    </div>
  );
}
