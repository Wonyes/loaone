import { Card } from "./Card";
import { cn } from "@/lib/utils";
import {
  ActivityIcon,
  Award,
  BarChart3,
  Bell,
  ChevronDown,
  Coins,
  Gem,
  Heart,
  Layers,
  LayoutGrid,
  Library,
  MapPin,
  ScrollText,
  Shield,
  Star,
  Sword,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <div className="space-y-3 p-6">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    </Card>
  );
}

export function EventTimerSkeleton() {
  return (
    <Card className="animate-pulse border-white/[0.05] bg-white/[0.01] p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-white/10" />
          <div className="h-6 w-24 rounded bg-white/10" />
        </div>
        <div className="h-6 w-6 rounded bg-white/10" />
      </div>
    </Card>
  );
}

export function IslandCardSkeleton() {
  return (
    <Card className="animate-pulse border-white/[0.03] bg-white/[0.01] p-3">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-white/10" />
        <div className="h-4 w-24 rounded bg-white/10" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-6 rounded bg-white/10" />
          ))}
        </div>
        <div className="h-3 w-12 rounded bg-white/10" />
      </div>
    </Card>
  );
}

// 이벤트 슬라이더 스켈레톤
export function EventSliderSkeleton() {
  return (
    <div className="max-h-[400px] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
      <div className="relative h-[400px] animate-pulse bg-gradient-to-br from-white/[0.05] to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-48 rounded-lg bg-white/10" />
            <div className="mx-auto h-4 w-32 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 공지사항 섹션 스켈레톤
export function NoticeSectionSkeleton({ title }: { title: string }) {
  return (
    <Card title={title} icon={<Bell size={14} className="text-indigo-400" />}>
      <div className="space-y-1 p-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-3 w-20 rounded bg-white/10" />
            </div>
            <div className="h-4 w-full rounded bg-white/5" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// 즐겨찾기 스켈레톤
export function FavoritesSkeleton() {
  return (
    <Card
      title="Favorites"
      icon={<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center justify-between rounded-2xl px-3 py-2.5"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-3 w-16 rounded bg-white/5" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-3 w-12 rounded bg-white/10" />
            <div className="h-px w-2 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </Card>
  );
}

export function CharacterHeaderSkeleton() {
  return (
    <Card className="] relative overflow-hidden rounded-[2rem] border-none shadow-2xl">
      <div className="absolute inset-y-0 right-0 z-0 w-full overflow-hidden sm:w-[60%]">
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      <div className="absolute top-4 right-4 z-30">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
      </div>

      <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-8 sm:p-12 xl:min-h-[350px]">
        <div className="max-w-2xl space-y-8">
          <div className="flex flex-wrap gap-2.5">
            <div className="h-7 w-20 animate-pulse rounded-lg bg-white/10" />
            <div className="h-7 w-24 animate-pulse rounded-lg bg-purple-500/20" />
            <div className="h-7 w-28 animate-pulse rounded-lg bg-amber-500/20" />
          </div>

          <div className="space-y-3">
            <div className="h-14 w-64 animate-pulse rounded-lg bg-white/10 sm:h-16 xl:h-20" />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
              <Gem className="text-emerald-400 opacity-70" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-2">
              <Sword className="text-violet-400 opacity-70" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.03] bg-white/[0.02] px-3 py-2">
              <Shield
                size={13}
                className="shrink-0 text-emerald-500 opacity-30"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <div className="h-2 w-12 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.03] bg-white/[0.02] px-3 py-2">
              <MapPin
                size={13}
                className="shrink-0 text-slate-400 opacity-30"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <div className="h-2 w-12 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.03] bg-white/[0.02] px-3 py-2">
              <Award size={13} className="shrink-0 text-amber-500 opacity-30" />
              <div className="flex min-w-0 flex-col gap-1">
                <div className="h-2 w-12 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 장비 탭 전체 스켈레톤
export function EquipmentTabSkeleton() {
  return (
    <div className="space-y-4">
      <Card
        title="장비 및 장신구"
        icon={<Shield size={14} className="text-blue-400" />}
      >
        <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2">
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 xl:grid-cols-1">
        <Card
          title="보석"
          icon={<Gem size={14} className="h-full text-indigo-400" />}
        >
          <div className="p-4">
            <div className="grid grid-cols-6 gap-1 md:grid-cols-11">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square w-full animate-pulse rounded border border-white/10 bg-white/10"
                />
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="카드 세트 및 수집"
          icon={
            <Library
              size={14}
              className="flex h-full flex-col text-amber-400"
            />
          }
        >
          <div className="space-y-2 p-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// 아크 그리드 스켈레톤
export function ArkGridSkeleton() {
  return (
    <Card
      title="아크 그리드"
      icon={<LayoutGrid size={14} className="text-indigo-400" />}
    >
      <div className="grid grid-cols-2 gap-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/40 p-2.5"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-white/10" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-full animate-pulse rounded bg-white/10" />
              <div className="h-2 w-16 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 아크 패시브 스켈레톤
export function ArkPassiveSkeleton() {
  return (
    <Card
      title="아크 패시브"
      icon={<Zap size={18} className="text-yellow-400" />}
    >
      <div className="grid grid-cols-3 gap-3 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            {/* 상단 포인트 카드 */}
            <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-slate-800/40 p-3">
              <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              <div className="h-6 w-12 animate-pulse rounded bg-white/10" />
              <div className="h-2 w-20 animate-pulse rounded bg-white/5" />
            </div>

            {/* 효과 리스트 */}
            <div className="space-y-1.5">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-slate-800/40 p-2"
                >
                  <div className="h-7 w-7 shrink-0 animate-pulse rounded-md bg-white/10" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-2 w-12 animate-pulse rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 각인 스켈레톤
export function EngravingsSkeleton() {
  return (
    <Card
      title="각인"
      icon={<ScrollText size={14} className="text-cyan-400" />}
    >
      <div className="space-y-2 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-xl bg-cyan-500/5"
          />
        ))}
      </div>
    </Card>
  );
}

// 수집형 포인트 스켈레톤
export function CollectibleSkeleton() {
  return (
    <Card
      title="수집형 포인트"
      icon={<Trophy size={14} className="text-amber-500" />}
    >
      <div className="space-y-1 p-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-1.5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// 아바타 페이지 스켈레톤
export function AvatarPageSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-1">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* 왼쪽: 캐릭터 프로필 */}
        <div className="lg:col-span-4">
          <Card className="relative h-full max-h-[550px] overflow-hidden border-none bg-[#15181D]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e1b4b_0%,transparent_70%)] opacity-40" />

            {/* 캐릭터 이미지 영역 */}
            <div className="relative flex h-full items-end justify-center pb-24">
              <div className="h-[400px] w-[300px] animate-pulse rounded-lg bg-white/5" />
            </div>

            {/* 상단 라벨 */}
            <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
              <div className="h-px w-8 bg-white" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            </div>

            {/* 하단 이름/서버 */}
            <div className="absolute right-0 bottom-10 left-0 z-30 flex flex-col items-center">
              <div className="mb-4 h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/5" />
            </div>
          </Card>
        </div>

        {/* 오른쪽 */}
        <div className="flex flex-col gap-3 lg:col-span-8">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            {/* 착용 아바타 */}
            <Card
              title="착용 아바타"
              icon={<Layers size={16} className="text-indigo-400" />}
              className="h-full lg:col-span-3"
            >
              <div className="grid grid-cols-4 gap-4 p-5">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
                      {i < 4 && (
                        <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
                      )}
                    </div>
                    <div className="h-3 w-12 animate-pulse rounded bg-white/5" />
                  </div>
                ))}
              </div>
            </Card>

            {/* 성향 */}
            <Card
              title="성향"
              icon={<Heart size={16} className="text-rose-400" />}
              className="lg:col-span-1"
            >
              <div className="flex flex-col gap-5 p-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-12 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
                    </div>
                    <div className="h-1.5 w-full animate-pulse rounded-full bg-white/5" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 염색 및 패턴 */}
          <Card
            title="염색 및 패턴"
            icon={<Layers size={16} className="text-indigo-400" />}
          >
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-white/10" />
                      <div className="h-3 w-20 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-12 rounded bg-white/5" />
                      <div className="flex gap-2">
                        <div className="h-5 w-5 rounded bg-white/10" />
                        <div className="h-5 w-5 rounded bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 스킬 페이지 스켈레톤
export function SkillPageSkeleton() {
  return (
    <article className="mx-auto w-full max-w-[1400px] antialiased">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 왼쪽 사이드바 */}
        <aside className="flex flex-col gap-6 lg:col-span-3 xl:col-span-3">
          <div className="flex flex-col gap-6 sm:flex-row lg:flex-col">
            {/* Combat Stats */}
            <Card
              title="Combat Stats"
              icon={<BarChart3 size={16} className="text-indigo-400" />}
              className="w-full"
            >
              <div className="flex items-center justify-around p-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-10 w-px bg-white/5" />
                <div className="flex flex-col items-center gap-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-5 py-3">
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
              </div>
            </Card>

            {/* Skill Points */}
            <Card
              title="Skill Points"
              className="w-full"
              icon={<Zap size={16} className="text-amber-400" />}
            >
              <div className="flex flex-col justify-center p-6">
                <div className="mb-3 flex items-baseline justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-1.5 w-full animate-pulse rounded-full bg-white/5" />
              </div>
            </Card>
          </div>
        </aside>

        {/* 오른쪽 메인 콘텐츠 */}
        <div className="flex flex-col gap-6 lg:col-span-9 xl:col-span-9">
          {/* 보석 사이드바 스켈레톤 */}
          <Card
            title="GEM CONFIGURATION"
            icon={<Gem size={14} className="text-[#bef264]" />}
          >
            <div className="grid grid-cols-6 gap-1 p-4 md:grid-cols-11">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square w-full animate-pulse rounded border border-white/10 bg-white/10"
                />
              ))}
            </div>
          </Card>

          {/* 스킬 리스트 스켈레톤 */}
          <Card
            title="Combat Skill Configuration"
            icon={<Swords size={14} className="text-slate-400" />}
            headerAction={
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  - ACTIVE
                </span>
              </div>
            }
          >
            <div className="hidden grid-cols-12 border-b border-white/5 bg-white/[0.01] px-6 py-3 md:grid">
              <div className="col-span-3 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                Skill Identity
              </div>
              <div className="col-span-6 border-x border-white/5 text-center text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                Tripod Matrix
              </div>
              <div className="col-span-3 text-right text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                Runes & Gems
              </div>
            </div>

            <div className="divide-y divide-white/[0.03]">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-4 p-6 md:grid-cols-12"
                >
                  {/* 스킬 정보 */}
                  <div className="flex items-center gap-4 md:col-span-3">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
                    </div>
                  </div>

                  {/* 트라이포드 */}
                  <div className="flex gap-2 md:col-span-6 md:border-x md:border-white/5 md:px-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex-1 space-y-2">
                        <div className="h-8 w-full animate-pulse rounded-lg bg-white/5" />
                      </div>
                    ))}
                  </div>

                  {/* 룬 & 보석 */}
                  <div className="flex items-center justify-end gap-2 md:col-span-3">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </article>
  );
}

// 캐릭터 성장 궤적 스켈레톤
export function CharacterHistorySkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 px-0 pb-20 antialiased sm:space-y-8 sm:px-1">
      <Card
        className="overflow-hidden border-x-0 border-white/[0.06] bg-[#061a1a]/40 shadow-2xl sm:border-x"
        title={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
            <h2 className="text-[14px] font-black tracking-widest text-slate-100 uppercase sm:text-[15px]">
              성장 궤적
            </h2>
            <div className="flex items-center gap-3 border-t border-white/10 pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Peak
              </span>
              <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        }
        icon={<ActivityIcon size={14} className="text-[#bef264]" />}
        headerAction={
          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
          </div>
        }
      >
        <div className="h-[300px] w-full p-2 pt-16 sm:h-[450px] sm:p-10 sm:pt-20">
          {/* 차트 영역 스켈레톤 */}
          <div className="relative h-full w-full"></div>
        </div>
      </Card>
    </div>
  );
}

// 수집형포인트 카드 스켈레톤
export function CharacterCollectibleSkeleton() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 sm:p-6">
      {[...Array(10)].map((_, i) => (
        <Card
          key={i}
          icon={
            <div className="h-[22px] w-[22px] animate-pulse rounded bg-white/10" />
          }
          title={<div className="h-4 w-24 animate-pulse rounded bg-white/10" />}
          className="relative overflow-hidden"
          headerAction={
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-12 animate-pulse rounded bg-white/5" />
              </div>
              <ChevronDown size={20} className="text-gray-500" />
            </div>
          }
        >
          {/* 프로그레스 바 */}
          <div className="absolute top-2 left-[1.5rem] h-1.5 w-[calc(100%-3.6rem)] rounded-full bg-white/5">
            <div
              className="h-full animate-pulse rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-400/30"
              style={{ width: `${Math.random() * 60 + 20}%` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

// 내 캐릭 리스트 스켈레톤

export function CharacterListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-12 px-4 pb-20 sm:px-6">
      <div className="mb-6 w-full px-1">
        <Card className="overflow-hidden border border-[#bef264]/10 shadow-2xl">
          <div className="flex cursor-pointer items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#bef264]/10">
                <Coins size={14} className="text-[#bef264]" />
              </div>
              <span className="text-[14px] font-black tracking-[0.2em] text-teal-500/60 uppercase">
                weekly gold
              </span>
            </div>
            <div className="flex items-center gap-8">
              <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
              <ChevronDown size={20} className="text-slate-600" />
            </div>
          </div>
        </Card>
      </div>

      {[...Array(2)].map((_, serverIdx) => (
        <section key={serverIdx} className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {[...Array(6)].map((_, charIdx) => (
              <div
                key={charIdx}
                className="flex h-[66px] w-full items-center rounded-full border border-white/5 bg-white/[0.02] px-5"
              >
                <div className="grid w-full grid-cols-[44px_1fr_90px] items-center gap-4">
                  {/* 프로필 이미지 */}
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-white/10" />

                  {/* 이름/클래스 */}
                  <div className="ml-1 flex min-w-0 flex-col gap-1.5">
                    <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
                  </div>

                  {/* 레벨 */}
                  <div className="flex flex-col items-end gap-1 border-l border-white/5 py-1 pl-4">
                    <div className="h-2 w-12 animate-pulse rounded bg-white/5" />
                    <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
