import { cn } from "@/lib/utils";

interface HoverTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  position?: "top" | "bottom";
}

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
          position === "bottom" ? "top-full mt-3" : "bottom-full mb-2",
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}
