import { GRADE_STYLES } from "@/constants/lostark/styles";

interface ItemIconProps {
  src: string;
  alt: string;
  grade?: keyof typeof GRADE_STYLES;
  tier?: number | null;
  size?: "xs" | "sm" | "md";
}

export function ItemIcon({
  src,
  alt,
  grade = "전설",
  tier,
  size = "md",
}: ItemIconProps) {
  const sizeClasses = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-11 w-11",
  };

  const gradeStyle = GRADE_STYLES[grade] || GRADE_STYLES.전설;

  return (
    <div
      className={`relative ${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded border ${gradeStyle.bg} ${gradeStyle.border}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {tier !== null && tier !== undefined && (
        <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded bg-amber-600/90 text-center text-[10px] leading-[14px] font-bold text-white">
          T{tier}
        </div>
      )}
    </div>
  );
}
