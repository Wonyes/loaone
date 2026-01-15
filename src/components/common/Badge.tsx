// components/common/Badge.tsx
interface BadgeProps {
  children?: React.ReactNode;
  variant?: "quality" | "level" | "emerald" | "violet" | "purple" | "amber";
  quality?: number;
  className?: string;
}

const getQualityStyles = (qualityValue: number) => {
  if (qualityValue === 100)
    return "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold";
  if (qualityValue >= 90)
    return "bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold";
  if (qualityValue >= 70)
    return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold";
  return "bg-gray-600/80 text-gray-200 font-medium";
};

export function Badge({
  children,
  variant = "level",
  quality,
  className = "",
}: BadgeProps) {
  // quality는 별도 처리
  if (variant === "quality" && quality !== undefined) {
    const qualityStyle = getQualityStyles(quality);
    return (
      <span
        className={`${qualityStyle} rounded px-1 py-0.5 text-[10px] shadow-sm ${className}`}
      >
        {quality}
      </span>
    );
  }

  // 나머지 variant 처리
  const variantClasses = {
    level: "bg-gray-700 text-white",
    emerald: "bg-emerald-500/20 text-emerald-400",
    violet: "bg-violet-500/20 text-violet-400",
    purple: "bg-purple-500/20 text-purple-400",
    amber: "bg-amber-500/20 text-amber-400",
  } as const;

  return (
    <span
      className={`rounded px-1 py-0.5 text-[10px] font-semibold ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}
    >
      {children}
    </span>
  );
}
