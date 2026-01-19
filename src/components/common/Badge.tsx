import { cn } from "@/lib/utils";
import { getQualityStyles } from "@/utils/lostarkUtils";

export type BadgeVariant =
  | "quality"
  | "level"
  | "emerald"
  | "violet"
  | "purple"
  | "amber";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  quality?: number;
  className?: string;
}

const VARIANT_STYLES: Record<Exclude<BadgeVariant, "quality">, string> = {
  level: "bg-gray-700 text-white",
  emerald: "bg-emerald-500/20 text-emerald-400",
  violet: "bg-violet-500/20 text-violet-400",
  purple: "bg-purple-500/20 text-purple-400",
  amber: "bg-amber-500/20 text-amber-400",
};

export function Badge({
  children,
  variant = "level",
  quality,
  className,
}: BadgeProps) {
  const baseStyles = "rounded px-1 py-0.5 text-[10px]";

  if (variant === "quality" && quality !== undefined) {
    return (
      <span className={cn(baseStyles, getQualityStyles(quality), className)}>
        {quality}
      </span>
    );
  }

  return (
    <span
      className={cn(
        baseStyles,
        "font-semibold",
        VARIANT_STYLES[variant as Exclude<BadgeVariant, "quality">],
        className
      )}
    >
      {children}
    </span>
  );
}
