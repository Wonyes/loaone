import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  icon?: ReactNode;
  title?: string | ReactNode;
  children?: ReactNode;
  chillClass?: string;
  className?: string;
  headerAction?: ReactNode;
  onClick?: () => void;
}

export function Card({
  icon,
  title,
  onClick,
  children,
  chillClass = "",
  className = "",
  headerAction,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2rem] border border-white/[0.1] bg-white/[0.02] shadow-2xl",
        "before:absolute before:inset-0 before:-z-10 before:rounded-[2rem] before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent",
        className
      )}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
          <div className="flex items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <h2 className="text-[13px] font-black tracking-[0.2em] text-white/90 uppercase">
              {title}
            </h2>
          </div>
          {headerAction}
        </div>
      )}
      <div className={(cn("relative"), chillClass)}>{children}</div>
    </div>
  );
}
