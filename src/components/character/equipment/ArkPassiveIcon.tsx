// components/lostark/ArkPassiveIcon.tsx
import { Sparkles, Zap, Flame } from "lucide-react";

export function ArkPassiveIcon({
  type,
  size = 14,
}: {
  type: "sparkles" | "zap" | "flame" | null;
  size?: number;
}) {
  if (!type) return null;

  const icons = {
    sparkles: <Sparkles size={size} />,
    zap: <Zap size={size} />,
    flame: <Flame size={size} />,
  };

  return icons[type];
}
