import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({
  icon,
  title,
  children,
  className = "",
  headerAction,
}: CardProps) {
  return (
    <div
      className={cn(
        "design-card rounded-xl border border-white/10 bg-slate-900/50 p-0",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-1">
            {icon && icon}
            <h3 className="text-base font-bold text-gray-200">{title}</h3>
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
