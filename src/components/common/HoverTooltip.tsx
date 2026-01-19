import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TooltipPosition = "top" | "bottom";

export interface HoverTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  position?: TooltipPosition;
}

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  bottom: "top-full mt-3",
  top: "bottom-full mb-2",
};

export function HoverTooltip({
  children,
  content,
  className = "w-[340px]",
  position = "bottom",
}: HoverTooltipProps) {
  return (
    <div className="group relative">
      {children}
      <div
        className={cn(
          "pointer-events-none absolute left-0 z-[100] hidden rounded-xl border border-white/10 bg-[#0c0d12]/98 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group-hover:block",
          POSITION_CLASSES[position],
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}
