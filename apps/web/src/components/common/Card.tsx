import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({
  title,
  children,
  className = "",
  headerAction,
}: CardProps) {
  return (
    <div
      className={`design-card rounded-xl border border-white/10 bg-slate-900/50 p-0 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="text-base font-bold text-gray-200">{title}</h3>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
