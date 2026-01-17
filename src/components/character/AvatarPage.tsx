"use client";

import { useAvatars } from "@/hooks/query/lostark/character/useLostarkApi";
import { Card } from "@/components/common/Card";
import Loading from "@/app/loading";
import { Layers, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import DyeInfo from "./avatar/DyeInfo";
import { getGradeStyle } from "@/utils/lostarkUtils";

export default function AvatarPage({
  name,
  profileData,
}: {
  name: string;
  profileData: any;
}) {
  const { data: avatarData, isLoading } = useAvatars(name);

  if (isLoading) return <Loading />;
  if (avatarData === null) return undefined;
  const groupedAvatars = avatarData.reduce((acc: any, avatar: any) => {
    const type = avatar.Type;
    if (!acc[type]) acc[type] = { inner: null, outer: null };
    if (avatar.IsInner) acc[type].inner = avatar;
    else acc[type].outer = avatar;
    return acc;
  }, {});

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
    <div className="flex flex-col gap-3 p-1">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card className="relative h-full max-h-[550px] overflow-hidden border-none bg-[#15181D]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
              <span className="rotate-90 text-[12rem] leading-none font-black tracking-tighter text-white/[0.02] uppercase">
                {profileData?.CharacterClassName}
              </span>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e1b4b_0%,transparent_70%)] opacity-40" />

            <div className="relative flex h-full items-end justify-center pb-24">
              {profileData?.CharacterImage ? (
                <img
                  src={profileData.CharacterImage}
                  alt="preview"
                  className="relative z-20 h-auto w-full max-w-[400px] scale-[1.2] object-cover drop-shadow-[0_20px_80px_rgba(0,0,0,1)] transition-transform duration-1000 ease-out hover:scale-[1.25]"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)",
                  }}
                />
              ) : undefined}

              <div className="absolute bottom-32 z-10 h-32 w-full bg-gradient-to-t from-purple-500/10 to-transparent blur-2xl" />
            </div>

            <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
              <div className="h-px w-8 bg-white" />
              <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                Identity Profile
              </span>
            </div>

            <div className="absolute right-0 bottom-10 left-0 z-30 flex flex-col items-center">
              <div className="mb-2 flex items-center gap-4 opacity-90">
                <div className="h-px w-6 bg-white/30" />
                <span className="text-[12px] font-medium tracking-[0.4em] uppercase">
                  {profileData?.ServerName}
                </span>
                <div className="h-px w-6 bg-white/30" />
              </div>

              <h2 className="text-3xl font-black tracking-tighter text-white italic drop-shadow-2xl">
                {profileData?.CharacterName}
              </h2>

              <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-purple-400/80 uppercase">
                {profileData?.CharacterClassName}
              </p>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
          </Card>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-8">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            <Card
              title="착용 아바타"
              icon={<Layers size={16} className="text-indigo-400" />}
              className="h-full lg:col-span-3"
            >
              <div className="grid grid-cols-4 gap-4 p-5">
                {avatarSlots === null
                  ? undefined
                  : avatarSlots.map(slotType => (
                      <AvatarSlot
                        key={slotType}
                        type={slotType}
                        slot={
                          groupedAvatars[slotType] || {
                            inner: null,
                            outer: null,
                          }
                        }
                      />
                    ))}
              </div>
            </Card>

            <Card
              title="성향"
              icon={<Heart size={16} className="text-rose-400" />}
              className="lg:col-span-1"
            >
              <div className="flex flex-col gap-5 p-5">
                {profileData?.Tendencies
                  ? profileData.Tendencies.map((t: any, idx: number) => (
                      <TendencyBar key={idx} name={t.Type} value={t.Point} />
                    ))
                  : undefined}
              </div>
            </Card>
          </div>

          <DyeInfo avatarData={avatarData} />
        </div>
      </div>
    </div>
  );
}

function TendencyBar({ name, value }: { name: string; value: number }) {
  const percentage = Math.min((value / 1000) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">
          {name}
        </span>
        <span className="font-mono text-xs font-bold text-white">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AvatarSlot({ type, slot }: { type: string; slot: any }) {
  const hasInner = !!slot.inner;
  const hasOuter = !!slot.outer;

  const getGrade = getGradeStyle(slot.outer?.Grade);
  const getGrade2 = getGradeStyle(slot.inner?.Grade);

  if (!hasInner && !hasOuter) return undefined;

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <div className="flex h-full items-center gap-1 sm:gap-2">
        {hasOuter && (
          <div
            className={cn(
              "relative h-9 w-9 rounded-xl transition-all duration-300 sm:h-12 sm:w-12",
              hasOuter
                ? `${getGrade.bg} shadow-lg group-hover:scale-105`
                : "border-dashed border-white/5 bg-white/[0.02] opacity-40"
            )}
          >
            <>
              <img
                src={slot.outer.Icon}
                alt=""
                className="h-ful l w-full rounded-lg object-cover"
              />
              <div className="absolute -top-1.5 -left-1.5 rounded-[4px] border border-white/10 bg-indigo-600 px-1 text-[7px] font-black text-white shadow-md sm:text-[8px]">
                S
              </div>
            </>
          </div>
        )}
        {hasInner && (
          <div
            className={cn(
              "relative h-9 w-9 rounded-xl transition-all duration-300 sm:h-12 sm:w-12",
              hasInner
                ? `${getGrade2.bg} shadow-lg group-hover:scale-105`
                : "border-dashed border-white/5 bg-white/[0.02] opacity-40"
            )}
          >
            <>
              <img
                src={slot.inner.Icon}
                alt=""
                className="h-full w-full rounded-lg object-cover"
              />
              <div className="absolute -top-1.5 -left-1.5 rounded-[4px] border border-white/10 bg-emerald-600 px-1 text-[7px] font-black text-white shadow-md sm:text-[8px]">
                T
              </div>
            </>
          </div>
        )}
      </div>

      <p className="text-center text-[9px] font-bold text-gray-500 transition-colors group-hover:text-gray-300 sm:text-[11px]">
        {type.replace(" 아바타", "")}
      </p>

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
                    getGrade.text
                  )}
                >
                  {slot.outer.Name}
                </p>
              </div>
              <p className="ml-10 text-[11px] text-gray-500">Appearance Only</p>
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
                    getGrade2.text
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
