"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Palette, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";
import { EmptyCard } from "@/components/common/NoItems";
import { getGradeStyle } from "@/utils/lostarkUtils";

export default function DyeInfo({ avatarData }: { avatarData: any[] }) {
  const dyedAvatars = avatarData?.filter(
    (avatar: any) =>
      avatar.tooltip?.Element_009?.type === "ItemTintGroup" ||
      avatar.tooltip?.Element_010?.type === "ItemTintGroup"
  );

  if (!dyedAvatars || dyedAvatars.length === 0)
    return (
      <EmptyCard
        title="염색 및 패턴"
        icon={<Palette size={18} className="text-amber-400" />}
        message="염색 정보가 없습니다."
        className="h-full"
      />
    );

  return (
    <Card
      title="염색 및 패턴"
      icon={<Palette size={18} className="text-amber-400" />}
    >
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {dyedAvatars.map((avatar: any, idx: number) => {
          const tintData =
            avatar.tooltip?.Element_009?.value?.itemData ||
            avatar.tooltip?.Element_010?.value?.itemData;

          if (!tintData) return undefined;

          const gradeStyle = getGradeStyle(avatar.Grade);

          return (
            <div
              key={idx}
              className="rounded-xl border border-white/5 bg-slate-900/40 p-4"
            >
              <div className="mb-3 flex items-center gap-3 border-b border-white/5 pb-3">
                <img
                  src={avatar.Icon}
                  className={cn(
                    "h-10 w-10 rounded-lg border",
                    gradeStyle.border
                  )}
                  alt=""
                />

                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-bold",
                      gradeStyle.text
                    )}
                  >
                    {avatar.Name}
                  </p>
                  <p className="text-[11px] text-gray-500">{avatar.Type}</p>
                </div>
              </div>

              <div className="space-y-2">
                {Object.keys(tintData).map(key => {
                  const part = tintData[key];
                  if (!part) return undefined;
                  return <DyeRow key={key} part={part} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function DyeRow({ part }: { part: any }) {
  const showToast = useNoticeStore(state => state.showToast);
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);

    showToast("복사가 완료되었습니다.");
    setTimeout(() => setCopied(null), 1000);
  };
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-white/5 bg-black/20 p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400">
          {part.title}
        </span>
        <span className="rounded bg-emerald-500/10 px-1.5 text-[10px] font-bold text-emerald-500">
          광택 {part.glossValue}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className="h-4 w-4 rounded-sm border border-white/20"
            style={{ backgroundColor: part.baseColor }}
          />
          <button
            onClick={() => onCopy(part.baseColor, `${part.title}-base`)}
            className="group #B2B1BAgap-1 flex cursor-pointer items-center gap-2 font-mono text-xs font-medium text-gray-300 hover:text-white"
          >
            {part.baseColor.toUpperCase()}
            {copied === `${part.title}-base` ? (
              <Check size={10} className="text-emerald-400" />
            ) : (
              <Copy
                size={10}
                className="text-gray-600 group-hover:text-gray-400"
              />
            )}
          </button>
        </div>

        {part.patternColor && part.patternColor !== "0x000000" && (
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <div
              className="h-4 w-4 rounded-sm border border-white/20"
              style={{ backgroundColor: part.patternColor }}
            />
            <button
              onClick={() => onCopy(part.patternColor, `${part.title}-pt`)}
              className="group flex cursor-pointer items-center gap-2 font-mono text-xs font-medium text-purple-300 hover:text-purple-100"
            >
              {part.patternColor.toUpperCase()}
              {copied === `${part.title}-pt` ? (
                <Check size={10} className="text-emerald-400" />
              ) : (
                <Copy
                  size={10}
                  className="text-gray-600 group-hover:text-gray-400"
                />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
