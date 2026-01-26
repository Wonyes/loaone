import { getGradeStyle } from "@/utils/lostarkUtils";
import { cn } from "@/lib/utils";

interface IslandRewardModalProps {
  island: any;
  onClose: () => void;
}

export function IslandRewardModal({ island, onClose }: IslandRewardModalProps) {
  if (!island) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-black/60 sm:hidden"
      onClick={onClose}
    >
      <div
        className="animate-in slide-in-from-bottom w-full rounded-t-[2rem] border-t border-white/10 bg-[#0f0f11] p-6 pb-10 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-white/10" />

        <IslandHeader island={island} />
        <RewardItemList items={island.RewardItems?.[0]?.Items} />

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-400 transition-colors hover:bg-white/10"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function IslandHeader({ island }: { island: any }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <img
        src={island.ContentsIcon}
        alt=""
        className="h-12 w-12 rounded-xl border border-white/10"
      />
      <div>
        <h2 className="text-lg font-bold text-white">{island.ContentsName}</h2>
        <p className="text-xs text-slate-300">전체 보상 리스트</p>
      </div>
    </div>
  );
}

function RewardItemList({ items }: { items?: any[] }) {
  if (!items) return null;

  return (
    <div className="scrollbar-hide grid max-h-[40vh] grid-cols-1 gap-3 overflow-y-auto pr-2">
      {items.map((item: any, i: number) => (
        <RewardItem key={i} item={item} />
      ))}
    </div>
  );
}

function RewardItem({ item }: { item: any }) {
  const gradeStyle = getGradeStyle(item.Grade);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2">
      <div className={cn("h-8 w-8 shrink-0 rounded-lg p-1", gradeStyle.bg)}>
        <img src={item.Icon} alt="" className="h-full w-full object-contain" />
      </div>
      <span className="text-sm font-medium text-slate-200">{item.Name}</span>
    </div>
  );
}
