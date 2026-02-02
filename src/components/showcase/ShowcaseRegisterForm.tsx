"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/query/lostark/character/useLostarkApi";
import { useUpsertShowcase, useShowcase } from "@/hooks/query/showcase";
import { Card } from "@/components/common/Card";
import { Search, Loader2, Check, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShowcaseRegisterForm() {
  const router = useRouter();
  const [characterName, setCharacterName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { data: existingShowcase } = useShowcase();
  const { data: profileData, isLoading: isSearching, error: searchError } = useProfile(searchName);
  const upsertMutation = useUpsertShowcase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      setSearchName(characterName.trim());
    }
  };

  const handleRegister = async () => {
    if (!profileData) return;

    try {
      await upsertMutation.mutateAsync({
        character_name: profileData.CharacterName,
        server_name: profileData.ServerName,
        class_name: profileData.CharacterClassName,
        item_level: profileData.ItemAvgLevel,
        character_image: profileData.CharacterImage || undefined,
        description: description.trim() || undefined,
        is_public: isPublic,
      });
      router.push("/showcase");
    } catch (error) {
      console.error("등록 실패:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {existingShowcase && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-amber-300">
                이미 등록된 캐릭터가 있습니다
              </p>
              <p className="text-xs text-amber-300/60">
                현재 대표 캐릭터: {existingShowcase.character_name} - 새로 등록하면 기존 캐릭터가 대체됩니다
              </p>
            </div>
          </div>
        </div>
      )}

      <Card
        title="캐릭터 검색"
        icon={<Search size={16} className="text-indigo-400" />}
      >
        <form onSubmit={handleSearch} className="p-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="캐릭터 이름을 입력하세요"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={!characterName.trim() || isSearching}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              검색
            </button>
          </div>
        </form>
      </Card>

      {searchError && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
          <p className="text-sm text-rose-400">캐릭터를 찾을 수 없습니다</p>
        </div>
      )}

      {profileData && (
        <>
          <Card
            title="캐릭터 미리보기"
            icon={<User size={16} className="text-emerald-400" />}
          >
            <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
              <div className="relative h-[300px] w-[200px] shrink-0 overflow-hidden rounded-2xl bg-[#15181D]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e1b4b_0%,transparent_70%)] opacity-40" />
                {profileData.CharacterImage && (
                  <img
                    src={profileData.CharacterImage}
                    alt={profileData.CharacterName}
                    className="relative z-10 h-full w-full object-cover"
                    style={{
                      maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                    }}
                  />
                )}
                <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
                  <p className="text-lg font-black text-white">
                    {profileData.CharacterName}
                  </p>
                  <p className="text-xs text-purple-400">
                    {profileData.CharacterClassName}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="서버" value={profileData.ServerName} />
                  <InfoItem label="클래스" value={profileData.CharacterClassName} />
                  <InfoItem label="아이템 레벨" value={profileData.ItemAvgLevel} />
                  <InfoItem label="전투 레벨" value={`Lv.${profileData.CharacterLevel}`} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    한마디 (선택)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="나를 표현하는 한마디를 남겨보세요"
                    maxLength={100}
                    className="h-20 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:outline-none"
                  />
                  <p className="text-right text-xs text-gray-500">
                    {description.length}/100
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      isPublic ? "bg-emerald-600" : "bg-gray-600"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        isPublic ? "left-[22px]" : "left-0.5"
                      )}
                    />
                  </button>
                  <span className="text-sm text-gray-300">
                    {isPublic ? "갤러리에 공개" : "비공개"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <button
            onClick={handleRegister}
            disabled={upsertMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {upsertMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
            {existingShowcase ? "대표 캐릭터 변경하기" : "대표 캐릭터 등록하기"}
          </button>
        </>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="mb-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
