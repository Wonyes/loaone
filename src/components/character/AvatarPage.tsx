// components/character/avatar/Avatar.tsx
"use client";

import { useCAvatars } from "@/hooks/query/lostark/character/useLostarkApi";
import { Card } from "@/components/common/Card";
import Loading from "@/app/loading";
import { GRADE_STYLES } from "@/constants/lostark/styles";
import { Layers } from "lucide-react";

export default function AvatarPage({
  name,
  profileData,
}: {
  name: string;
  profileData: any;
}) {
  const { data: avatarData, isLoading } = useCAvatars(name);

  if (isLoading) return <Loading />;

  // 아바타를 타입별로 그룹핑
  const groupedAvatars = avatarData?.reduce((acc: any, avatar: any) => {
    const type = avatar.Type;
    if (!acc[type]) {
      acc[type] = { inner: null, outer: null };
    }
    if (avatar.IsInner) {
      acc[type].inner = avatar;
    } else {
      acc[type].outer = avatar;
    }
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
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
      <div className="xl:col-span-4">
        <Card title="캐릭터 프리뷰" className="h-full overflow-hidden">
          <div className="relative h-full min-h-[500px] overflow-hidden rounded-b-xl xl:min-h-[600px]">
            <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />

            {profileData?.CharacterImage && (
              <img
                src={profileData.CharacterImage}
                alt={profileData.CharacterName}
                className="pointer-events-none absolute top-[50px] left-1/2 h-auto w-[280px] -translate-x-1/2 scale-[1.2] object-cover object-[50%_15%] mix-blend-lighten drop-shadow-[0_0_80px_rgba(168,85,247,0.55)] sm:h-[480px] sm:w-[320px] xl:h-[520px] xl:w-[360px] xl:scale-[1.3]"
                style={{
                  maskImage:
                    "linear-gradient(90deg, transparent, black 10% 80%, transparent), linear-gradient(to top, transparent 5%, black 20%)",
                  WebkitMaskImage:
                    "linear-gradient(90deg, transparent, black 10% 80%, transparent), linear-gradient(to top, transparent 5%, black 10%)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
              />
            )}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3 xl:col-span-8">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex-1 lg:flex-[3]">
            <Card title="착용 아바타" className="h-full">
              <div className="grid grid-cols-4 gap-2 p-3">
                {avatarSlots.map(slotType => {
                  const slot = groupedAvatars?.[slotType] || {
                    inner: null,
                    outer: null,
                  };
                  return (
                    <AvatarSlot key={slotType} type={slotType} slot={slot} />
                  );
                })}
              </div>
            </Card>
          </div>

          {profileData?.Tendencies && profileData.Tendencies.length > 0 && (
            <div className="flex-1 lg:flex-[1]">
              <Card title="성향" className="h-full">
                <div className="flex flex-col gap-2 p-3">
                  {profileData.Tendencies.map((tendency: any, idx: number) => (
                    <TendencyItem
                      key={idx}
                      name={tendency.Type}
                      value={tendency.Point}
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        <DyeInfo avatarData={avatarData} />
      </div>
    </div>
  );
}

function TendencyItem({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-800/30 p-3.5">
      <span className="text-sm font-medium text-gray-300">{name}</span>
      <span className="text-sm font-bold text-emerald-400">{value}</span>
    </div>
  );
}

function DyeInfo({ avatarData }: { avatarData: any[] }) {
  const dyedAvatars = avatarData?.filter(
    (avatar: any) =>
      avatar.tooltip?.Element_009?.type === "ItemTintGroup" ||
      avatar.tooltip?.Element_010?.type === "ItemTintGroup"
  );

  if (!dyedAvatars || dyedAvatars.length === 0) return null;

  return (
    <Card title="염색 정보">
      <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2 lg:grid-cols-3">
        {dyedAvatars.map((avatar: any, idx: number) => {
          const tintData =
            avatar.tooltip?.Element_009?.value?.itemData ||
            avatar.tooltip?.Element_010?.value?.itemData;

          if (!tintData) return null;

          const gradeStyle =
            GRADE_STYLES[avatar.Grade as keyof typeof GRADE_STYLES] ||
            GRADE_STYLES.전설;

          return (
            <div
              key={idx}
              className="rounded-lg border border-emerald-400/20 bg-slate-800/40 p-2.5 transition-all hover:border-emerald-400/40 hover:bg-slate-800/60"
            >
              <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                <img
                  src={avatar.Icon}
                  alt={avatar.Name}
                  className={`h-8 w-8 rounded border ${gradeStyle.border}`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-bold ${gradeStyle.text}`}
                  >
                    {avatar.Name.split(" ").slice(0, 3).join(" ")}
                  </p>
                  <p className="text-[12px] text-gray-400">{avatar.Type}</p>
                </div>
              </div>

              <div className="space-y-2">
                {Object.keys(tintData).map(key => {
                  const part = tintData[key];
                  if (!part) return null;

                  return (
                    <div key={key}>
                      <p className="mb-1 text-[12px] font-semibold text-gray-300">
                        {part.title}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-1 items-center gap-1">
                          <div
                            className="h-5 w-5 flex-shrink-0 rounded border border-white/30"
                            style={{ backgroundColor: part.baseColor }}
                          />
                          <span className="truncate font-mono text-[12px] text-gray-400">
                            {part.baseColor}
                          </span>
                        </div>

                        {part.glossValue && (
                          <span className="text-[12px] text-gray-500">
                            {part.glossValue}
                          </span>
                        )}

                        {part.patternColor &&
                          part.patternColor !== "#FFFFFF" && (
                            <div className="flex flex-1 items-center gap-1">
                              <div
                                className="h-5 w-5 flex-shrink-0 rounded border border-white/30"
                                style={{ backgroundColor: part.patternColor }}
                              />
                              <span className="truncate font-mono text-[9px] text-gray-400">
                                {part.patternColor}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AvatarSlot({ type, slot }: { type: string; slot: any }) {
  const hasInner = slot.inner !== null;
  const hasOuter = slot.outer !== null;

  if (!hasInner && !hasOuter) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-slate-800/30 p-2">
        <div className="flex aspect-square w-full items-center justify-center rounded border border-white/10 bg-slate-900/50">
          <span className="text-2xl text-gray-600">?</span>
        </div>
        <p className="text-center text-xs text-gray-500">
          {type.replace(" 아바타", "")}
        </p>
      </div>
    );
  }

  const outerAvatar = hasOuter ? slot.outer : null;
  const innerAvatar = hasInner ? slot.inner : null;

  return (
    <div className="group relative flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-slate-800/30 p-2 transition-all hover:border-emerald-400/30 hover:bg-slate-800/50">
      <div className="flex w-full gap-1">
        <AvatarIcon
          avatar={outerAvatar}
          label="겉"
          showLayer={hasOuter && hasInner}
        />
        <AvatarIcon avatar={innerAvatar} label="능력" />
      </div>

      <p className="text-center text-xs font-medium text-gray-400">
        {type.replace(" 아바타", "")}
      </p>

      <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 hidden w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-900/98 p-3 shadow-2xl group-hover:block">
        {hasOuter && hasInner ? (
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center gap-1">
                <Layers className="h-3 w-3 text-purple-400" />
                <p className="text-xs font-bold text-purple-400">겉모습</p>
              </div>
              <p
                className={`text-sm font-bold ${
                  GRADE_STYLES[slot.outer.Grade as keyof typeof GRADE_STYLES]
                    ?.text || ""
                }`}
              >
                {slot.outer.Name}
              </p>
            </div>

            <div className="border-t border-white/10 pt-2">
              <p className="mb-1 text-xs font-bold text-emerald-400">
                능력치 (전설)
              </p>
              <p
                className={`text-sm font-bold ${
                  GRADE_STYLES[slot.inner.Grade as keyof typeof GRADE_STYLES]
                    ?.text || ""
                }`}
              >
                {slot.inner.Name}
              </p>
              <p className="mt-1 text-xs text-emerald-300">
                {slot.inner.tooltip?.Element_005?.value?.Element_001 ||
                  slot.inner.tooltip?.Element_006?.value?.Element_001 ||
                  "-"}
              </p>
            </div>
          </div>
        ) : hasInner ? (
          <div>
            <p
              className={`mb-1 text-sm font-bold ${
                GRADE_STYLES[slot.inner.Grade as keyof typeof GRADE_STYLES]
                  ?.text || ""
              }`}
            >
              {slot.inner.Name}
            </p>
            <p className="text-xs text-emerald-300">
              {slot.inner.tooltip?.Element_005?.value?.Element_001 ||
                slot.inner.tooltip?.Element_006?.value?.Element_001 ||
                "-"}
            </p>
          </div>
        ) : (
          <div>
            <p
              className={`mb-1 text-sm font-bold ${
                GRADE_STYLES[slot.outer.Grade as keyof typeof GRADE_STYLES]
                  ?.text || ""
              }`}
            >
              {slot.outer.Name}
            </p>
            <p className="text-xs text-gray-400">겉모습 전용</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarIcon({
  avatar,
  label,
  showLayer = false,
}: {
  avatar: any;
  label: string;
  showLayer?: boolean;
}) {
  if (!avatar) {
    return (
      <div className="flex aspect-square flex-1 items-center justify-center rounded border border-white/10 bg-slate-900/50">
        <span className="text-xs text-gray-600">-</span>
      </div>
    );
  }

  const gradeStyle =
    GRADE_STYLES[avatar.Grade as keyof typeof GRADE_STYLES] ||
    GRADE_STYLES.전설;

  return (
    <div className="relative flex-1">
      <div
        className={`relative aspect-square overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border}`}
      >
        <img
          src={avatar.Icon}
          alt={avatar.Name}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />

        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent py-0.5">
          <p className="text-center text-[9px] font-bold text-white">{label}</p>
        </div>

        {showLayer && (
          <div className="absolute top-0.5 right-0.5 rounded-full bg-purple-500 p-0.5 shadow-lg">
            <Layers className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
