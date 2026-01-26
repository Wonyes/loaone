import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  icon?: ReactNode;
  title?: string | ReactNode;
  children?: ReactNode;
  contentClassName?: string;
  className?: string;
  headerAction?: ReactNode;
  onClick?: () => void;
  borderB?: boolean;
}

export function Card({
  icon,
  title,
  onClick,
  children,
  contentClassName,
  className,
  headerAction,
  borderB = true,
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
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-y-3 border-white/[0.05] px-4 py-3 sm:px-6 sm:py-4",
            borderB && "border-b"
          )}
        >
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {icon && (
              <div className="shrink-0 scale-90 sm:scale-100">{icon}</div>
            )}
            <h2 className="text-[14px] font-black tracking-[0.1em] whitespace-nowrap text-white/90 uppercase sm:text-[13px] sm:tracking-[0.2em]">
              {title}
            </h2>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
            {headerAction}
          </div>
        </div>
      )}
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
