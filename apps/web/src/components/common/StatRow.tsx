import { ReactNode } from "react";

interface StatRowProps {
  label: string;
  value: string | number;
  highlight?: "emerald" | "violet" | "none";
  icon?: ReactNode;
}

export function StatRow({
  label,
  value,
  highlight = "none",
  icon,
}: StatRowProps) {
  const styles = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
    none: { bg: "hover:bg-slate-800/50", text: "text-gray-300" },
  };

  const style = styles[highlight];

  return (
    <div
      className={`flex items-center justify-between rounded-lg p-1.5 transition-colors ${style.bg}`}
    >
      <span className={`font-medium ${style.text}`}>{label}</span>
      <div className="flex items-center gap-2">
        {icon}
        <span
          className={`font-bold ${highlight === "none" ? "text-white" : style.text}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
