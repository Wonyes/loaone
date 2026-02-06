"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/common/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ShowcaseLikeButton from "@/components/showcase/ShowcaseLikeButton";
import DyeInfo from "@/components/character/avatar/DyeInfo";
import { ArrowLeft, Layers, Loader2, Quote, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGradeStyle } from "@/utils/lostarkUtils";
import Link from "next/link";
import { useShowcaseDetail, useDeleteShowcase } from "@/hooks/query/showcase";
import { useUser } from "@/hooks/useUesr";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";

export default function ShowcaseDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { data: showcase, isLoading, isError } = useShowcaseDetail(id);
  const deleteMutation = useDeleteShowcase();
  const showAlert = useNoticeStore(state => state.showAlert);
  const showToast = useNoticeStore(state => state.showToast);

  const isOwner = !!user && !!showcase && user.id === showcase.user_id;

  const handleDelete = () => {
    showAlert(
      "삭제 확인",
      "이 게시글을 정말 삭제하시겠습니까?",
      "삭제",
      async () => {
        try {
          await deleteMutation.mutateAsync(id);
          showToast("게시글이 삭제되었습니다.");
          router.push("/showcase");
        } catch {
          showToast("삭제에 실패했습니다.");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError || !showcase) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-400">게시글을 찾을 수 없습니다.</p>
        <Link
          href="/showcase"
          className="text-xs text-indigo-400 hover:text-indigo-300"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const avatarData = showcase.avatar_items;

  // 아바타 슬롯 그룹핑 (DB에 저장된 스냅샷 사용)
  const groupedAvatars = avatarData
    ? avatarData.reduce((acc: any, avatar: any) => {
        const type = avatar.Type;
        if (!acc[type]) acc[type] = { inner: null, outer: null };
        if (avatar.IsInner) acc[type].inner = avatar;
        else acc[type].outer = avatar;
        return acc;
      }, {})
    : {};

  const avatarSlots = [
    "무기 아바타",
    "머리 아바타",
    "상의 아바타",
    "하의 아바타",
    "얼굴1 아바타",
    "얼굴2 아바타",
    "이동 효과",
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            삭제
          </button>
        )}
      </div>

      {/* 상단: 캐릭터 + 소개글 + 유저 정보 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 왼쪽: 작은 캐릭터 이미지 */}
        <div className="lg:col-span-3">
          <Card className="relative h-full overflow-hidden border-none bg-[#15181D]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e1b4b_0%,transparent_70%)] opacity-40" />

            <div className="relative flex h-[320px] items-end justify-center pb-16 lg:h-full lg:min-h-[360px]">
              {showcase.character_image ? (
                <img
                  src={showcase.character_image}
                  alt={showcase.character_name}
                  className="relative z-10 h-auto w-full max-w-[240px] object-cover drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                  }}
                />
              ) : (
                <p className="text-sm text-white/40">이미지 없음</p>
              )}
            </div>

            <div className="absolute right-0 bottom-4 left-0 z-20 flex flex-col items-center">
              <p className="text-lg font-black text-white">
                {showcase.character_name}
              </p>
              <p className="text-[10px] font-bold tracking-wider text-purple-400/80">
                {showcase.class_name}
              </p>
            </div>
          </Card>
        </div>

        {/* 오른쪽: 정보 + 소개글 */}
        <div className="flex flex-col gap-4 lg:col-span-9">
          {/* 캐릭터 정보 */}
          <Card className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black text-white">
                    {showcase.character_name}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    {showcase.server_name && (
                      <span className="text-gray-400">
                        {showcase.server_name}
                      </span>
                    )}
                    {showcase.class_name && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-purple-400">
                          {showcase.class_name}
                        </span>
                      </>
                    )}
                    {showcase.item_level && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-amber-400">
                          {showcase.item_level}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <ShowcaseLikeButton
                  showcaseId={showcase.id}
                  showcaseUserId={showcase.user_id}
                  likeCount={showcase.like_count}
                  isLiked={showcase.is_liked || false}
                />
              </div>
            </div>
          </Card>

          {/* 소개글 */}
          <Card
            title={
              <div className="flex gap-2">
                <Quote className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400/60" />
                <span>소개글</span>
              </div>
            }
            className="h-full"
            headerAction={
              <div className="flex items-center gap-3 px-1">
                <Avatar className="h-7 w-7 border border-white/10">
                  {showcase.discord_avatar ? (
                    <AvatarImage
                      src={showcase.discord_avatar}
                      alt={showcase.discord_name || ""}
                    />
                  ) : (
                    <AvatarFallback className="bg-indigo-600 text-[10px] font-bold text-white">
                      {showcase.discord_name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-bold text-white">
                  {showcase.discord_name || "Unknown"}
                </span>
                <span className="text-[11px] text-gray-400">
                  등록일 :
                  {new Date(showcase.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
            }
            contentClassName="flex justify-between items-start h-full"
          >
            <div className="p-3">
              <p className="text-sm leading-relaxed text-gray-300">
                {showcase.description
                  ? showcase.description
                  : "등록된 소개글이 없습니다."}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* 하단: 착용 아바타 + 염색 (DB 스냅샷) */}
      {avatarData && avatarData.length > 0 ? (
        <div className="space-y-4">
          <Card
            title="착용 아바타"
            icon={<Layers size={16} className="text-indigo-400" />}
          >
            <div className="grid grid-cols-4 gap-4 p-5 sm:grid-cols-7">
              {avatarSlots.map(slotType => (
                <AvatarSlot
                  key={slotType}
                  type={slotType}
                  slot={
                    groupedAvatars[slotType] || { inner: null, outer: null }
                  }
                />
              ))}
            </div>
          </Card>

          <DyeInfo avatarData={avatarData} />
        </div>
      ) : null}
    </div>
  );
}

function AvatarSlot({ type, slot }: { type: string; slot: any }) {
  const hasInner = !!slot.inner;
  const hasOuter = !!slot.outer;

  const gradeOuter = getGradeStyle(slot.outer?.Grade);
  const gradeInner = getGradeStyle(slot.inner?.Grade);

  if (!hasInner && !hasOuter) return null;

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <div className="flex h-full items-center gap-1 sm:gap-2">
        {hasOuter && (
          <div
            className={cn(
              "relative h-9 w-9 rounded-xl transition-all duration-300 sm:h-12 sm:w-12",
              `${gradeOuter.bg} shadow-lg group-hover:scale-105`
            )}
          >
            <img
              src={slot.outer.Icon}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute -top-1.5 -left-1.5 rounded-[4px] border border-white/10 bg-indigo-600 px-1 text-[7px] font-black text-white shadow-md sm:text-[8px]">
              S
            </div>
          </div>
        )}
        {hasInner && (
          <div
            className={cn(
              "relative h-9 w-9 rounded-xl transition-all duration-300 sm:h-12 sm:w-12",
              `${gradeInner.bg} shadow-lg group-hover:scale-105`
            )}
          >
            <img
              src={slot.inner.Icon}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute -top-1.5 -left-1.5 rounded-[4px] border border-white/10 bg-emerald-600 px-1 text-[7px] font-black text-white shadow-md sm:text-[8px]">
              T
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[9px] font-bold text-gray-500 transition-colors group-hover:text-gray-300 sm:text-[11px]">
        {type.replace(" 아바타", "")}
      </p>

      {/* 툴팁 */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-[100] mb-3 hidden w-[260px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0c0d12]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:block">
        <div className="space-y-4">
          {hasOuter && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-black text-indigo-400 uppercase">
                  Skin
                </span>
                <p
                  className={cn(
                    "text-[13px] leading-tight font-black",
                    gradeOuter.text
                  )}
                >
                  {slot.outer.Name}
                </p>
              </div>
            </div>
          )}
          {hasOuter && hasInner && <div className="h-px bg-white/5" />}
          {hasInner && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black text-emerald-400 uppercase">
                  Stat
                </span>
                <p
                  className={cn(
                    "text-[13px] leading-tight font-black",
                    gradeInner.text
                  )}
                >
                  {slot.inner.Name}
                </p>
              </div>
              <p className="ml-10 text-[11px] leading-relaxed font-bold text-emerald-300">
                {slot.inner.tooltip?.Element_005?.value?.Element_001 ||
                  slot.inner.tooltip?.Element_006?.value?.Element_001 ||
                  "-"}
              </p>
            </div>
          )}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0c0d12]" />
      </div>
    </div>
  );
}
