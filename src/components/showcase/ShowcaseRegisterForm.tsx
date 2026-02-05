"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useProfile,
  useSiblings,
  useAvatars,
} from "@/hooks/query/lostark/character/useLostarkApi";
import { useCreateShowcase } from "@/hooks/query/showcase";
import { Card } from "@/components/common/Card";
import {
  Loader2,
  Check,
  User,
  BadgeInfoIcon,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUesr";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";
import { getClassIcon } from "@/utils/lostarkUtils";
import { CharacterListSkeleton, EmptyCard } from "../common";

export default function ShowcaseRegisterForm() {
  const router = useRouter();
  const { user } = useUser();
  const mainCharacter = user?.user_metadata?.main_character || "";

  const [selectedName, setSelectedName] = useState("");
  const [description, setDescription] = useState("");

  const { data: listData, isLoading: listLoading } = useSiblings(mainCharacter);
  const { data: profileData, isLoading: profileLoading } =
    useProfile(selectedName);
  const { data: avatarData, isLoading: avatarLoading } =
    useAvatars(selectedName);
  const createMutation = useCreateShowcase();
  const showToast = useNoticeStore(state => state.showToast);

  const handleRegister = async () => {
    if (!profileData) return;

    try {
      await createMutation.mutateAsync({
        character_name: profileData.CharacterName,
        server_name: profileData.ServerName,
        class_name: profileData.CharacterClassName,
        item_level: profileData.ItemAvgLevel,
        character_image: profileData.CharacterImage || undefined,
        description: description.trim() || undefined,
        avatar_items: avatarData || undefined,
      });
      showToast("아바타가 등록되었습니다!");
      router.push("/showcase");
    } catch (error) {
      console.error("등록 실패:", error);
      showToast("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const groupedServers = useMemo(() => {
    if (!listData) return {};
    const sortedData = [...listData].sort((a: any, b: any) => {
      const levelA = parseFloat(a.ItemAvgLevel.replace(/,/g, ""));
      const levelB = parseFloat(b.ItemAvgLevel.replace(/,/g, ""));
      return levelB - levelA;
    });
    return sortedData.reduce((acc: any, char: any) => {
      const server = char.ServerName || "Unknown";
      if (!acc[server]) acc[server] = [];
      acc[server].push(char);
      return acc;
    }, {});
  }, [listData]);

  if (listLoading) return <CharacterListSkeleton />;
  if (!listData)
    return (
      <EmptyCard
        title={
          <div className="flex gap-2">
            <BadgeInfoIcon className="h-6 w-6 text-amber-500" />
            <span>내 캐릭터</span>
          </div>
        }
        message="캐릭터 정보가 없거나 점검으로 인해 정보가 없습니다."
      />
    );

  return (
    <div className="space-y-6">
      {/* 로딩 스켈레톤 */}
      {selectedName && profileLoading && (
        <Card
          title="캐릭터 미리보기"
          icon={<User size={16} className="text-emerald-400" />}
        >
          <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
            <div className="h-[300px] w-[200px] shrink-0 animate-pulse rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="mb-2 h-2 w-10 animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-2 w-16 animate-pulse rounded bg-white/10" />
                <div className="h-20 w-full animate-pulse rounded-xl bg-white/5" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 미리보기 + 등록 버튼 */}
      {selectedName && profileData && (
        <>
          <Card
            title="캐릭터 미리보기"
            icon={<User size={16} className="text-emerald-400" />}
          >
            <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
              <div className="relative h-[300px] w-[200px] shrink-0 overflow-hidden rounded-2xl bg-[#15181D]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e1b4b_0%,transparent_70%)] opacity-40" />
                {profileData.CharacterImage ? (
                  <img
                    src={profileData.CharacterImage}
                    alt={profileData.CharacterName}
                    className="relative z-10 h-full w-full object-cover"
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                    }}
                  />
                ) : (
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white/60">
                    이미지 정보가 없습니다.
                  </p>
                )}
                <div className="absolute right-0 bottom-4 left-0 z-20 text-center">
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
                  <InfoItem
                    label="클래스"
                    value={profileData.CharacterClassName}
                  />
                  <InfoItem
                    label="아이템 레벨"
                    value={profileData.ItemAvgLevel}
                  />
                  <InfoItem
                    label="전투 레벨"
                    value={`Lv.${profileData.CharacterLevel}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    한마디 (선택)
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="나를 표현하는 한마디를 남겨보세요"
                    maxLength={100}
                    className="h-20 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:outline-none"
                  />
                  <p className="text-right text-xs text-gray-500">
                    {description.length}/100
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <button
            onClick={handleRegister}
            disabled={createMutation.isPending || avatarLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
            아바타 자랑 등록하기
          </button>
        </>
      )}

      <Card
        title="캐릭터 선택하기"
        icon={<List size={16} className="text-indigo-400" />}
      >
        <div className="space-y-4 p-4">
          {Object.entries(groupedServers).map(
            ([serverName, characters]: any) => (
              <section key={serverName} className="space-y-3">
                <div className="flex items-center gap-4 px-1">
                  <h3 className="text-sm font-black tracking-tighter text-white uppercase">
                    {serverName}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    {characters.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {characters.map((char: any, idx: number) => (
                    <CharacterPillCard
                      key={`${char.CharacterName}-${idx}`}
                      char={char}
                      isSelected={selectedName === char.CharacterName}
                      onSelect={() => setSelectedName(char.CharacterName)}
                    />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      </Card>

      {selectedName && profileLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
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

function CharacterPillCard({
  char,
  isSelected,
  onSelect,
}: {
  char: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const displayIcon =
    char.CharacterImage || getClassIcon(char.CharacterClassName);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex h-[66px] w-full items-center rounded-full border px-5 shadow-lg transition-all duration-300",
        isSelected
          ? "border-indigo-500/40 bg-indigo-500/10"
          : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <div className="grid w-full grid-cols-[44px_1fr_90px] items-center gap-4">
        <div className="relative h-11 w-11 shrink-0">
          <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-slate-900 shadow-inner transition-transform duration-500 group-hover:scale-105">
            <img
              src={displayIcon}
              alt=""
              className={cn(
                "h-full w-full rounded-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0",
                !char.CharacterImage && "scale-110"
              )}
            />
          </div>
        </div>

        <div className="ml-1 flex min-w-0 flex-col text-left leading-tight">
          <h4 className="truncate text-[15px] font-bold tracking-tight text-slate-200 transition-colors group-hover:text-white">
            {char.CharacterName}
          </h4>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase">
              {char.CharacterClassName}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center border-l border-white/5 py-1 pl-4">
          <div className="flex items-baseline gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-widest text-slate-200 uppercase">
              Level
            </span>
            <span className="font-mono text-[9px] font-bold text-white tabular-nums">
              {char.CharacterLevel}
            </span>
          </div>
          <span className="font-mono text-[16px] font-black tracking-tight text-slate-100 tabular-nums transition-colors group-hover:text-[#bef264]">
            {char.ItemAvgLevel}
          </span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}
