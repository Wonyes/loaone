// components/ItemTooltip.tsx
import React from "react";
import { parseTooltipData } from "@/utils/tooltipParser";

interface ItemTooltipProps {
  tooltipData: any;
}

const ColoredText: React.FC<{
  segments: Array<{ text: string; color?: string }>;
}> = ({ segments }) => {
  return (
    <span>
      {segments.map((segment, idx) => (
        <span
          key={idx}
          style={segment.color ? { color: segment.color } : undefined}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
};

export const ItemTooltip: React.FC<ItemTooltipProps> = ({ tooltipData }) => {
  const parsed = parseTooltipData(tooltipData);
  return (
    <div className="max-w-md rounded-lg bg-gray-900 p-4 text-white shadow-xl">
      {/* 아이템 이름 */}
      <div className="mb-2 text-xl font-bold text-amber-300">{parsed.name}</div>

      {/* 등급 및 품질 */}
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-amber-300">{parsed.grade}</span>
        {parsed.quality > 0 && (
          <span className="text-gray-400">품질 {parsed.qualityValue}</span>
        )}
      </div>

      {/* 아이템 레벨 */}
      {parsed.itemLevel && (
        <div className="mb-3 text-sm text-gray-400">{parsed.itemLevel}</div>
      )}

      {/* 기본 효과 */}
      {parsed.basicEffects.length > 0 && (
        <div className="mb-3 border-b border-gray-700 pb-3">
          <div className="mb-1 text-sm text-blue-400">기본 효과</div>
          {parsed.basicEffects.map((effect: any, idx: number) => (
            <div key={idx} className="text-sm">
              <ColoredText segments={effect.segments} />
            </div>
          ))}
        </div>
      )}

      {/* 연마 효과 */}
      {parsed.additionalEffects.length > 0 && (
        <div className="mb-3 border-b border-gray-700 pb-3">
          <div className="mb-1 text-sm text-blue-400">연마 효과</div>
          {parsed.additionalEffects.map((effect: any, idx: number) => (
            <div key={idx} className="flex items-start gap-1 text-sm">
              <span className="text-green-500">•</span>
              <ColoredText segments={effect.segments} />
            </div>
          ))}
        </div>
      )}

      {/* 아크 패시브 */}
      {parsed.arkPassivePoints.length > 0 && (
        <div className="mb-3 border-b border-gray-700 pb-3">
          <div className="mb-1 text-sm text-blue-400">
            아크 패시브 포인트 효과
          </div>
          {parsed.arkPassivePoints.map((point: string, idx: number) => (
            <div key={idx} className="text-sm">
              {point}
            </div>
          ))}
        </div>
      )}

      {/* 획득처 */}
      {parsed.dropLocations.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-sm text-blue-400">획득처</div>
          {parsed.dropLocations.map((location: string, idx: number) => (
            <div key={idx} className="text-xs text-cyan-400">
              {location}
            </div>
          ))}
        </div>
      )}

      {/* 거래 정보 */}
      {parsed.bindInfo && (
        <div className="mt-3 text-xs text-gray-500">{parsed.bindInfo}</div>
      )}
    </div>
  );
};
