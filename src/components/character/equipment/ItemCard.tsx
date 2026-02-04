import { cn } from "@/lib/utils";
import { getGradeStyle, getTierNumber } from "@/utils/lostarkUtils";
import type { ReactNode } from "react";

export interface ItemCardProps {
  item: {
    Grade: string;
    Icon: string;
    tooltip?: {
      Element_001?: {
        value?: {
          leftStr2?: string;
        };
      };
    };
  };
  children: ReactNode;
  showTierBadge?: boolean;
  className?: string;
}

export function ItemCard({
  item,
  children,
  showTierBadge = true,
  className,
}: ItemCardProps) {
  const grade = getGradeStyle(item.Grade);
  const tier = getTierNumber(item.tooltip?.Element_001?.value?.leftStr2 ?? "");

  return (
    <div
      className={cn(
        "flex h-[68px] items-center gap-3 rounded-xl border border-white/5 bg-slate-800/40 p-2 transition-all hover:border-white/20 hover:bg-slate-900/60",
        className
      )}
    >
      <div
        className={cn(
          "relative h-11 w-11 shrink-0 rounded-xl p-0.5",
          grade.bg,
          grade.border
        )}
      >
        <img src={item.Icon} className="h-full w-full rounded-lg" alt="" />
        {showTierBadge && tier > 0 && (
          <div className="absolute -top-1.5 -right-1 rounded bg-amber-600 px-1 text-[9px] font-black text-white shadow-lg">
            T{tier}
          </div>
        )}
      </div>
      <div className="relative min-w-0 flex-1">{children}</div>
    </div>
  );
}
