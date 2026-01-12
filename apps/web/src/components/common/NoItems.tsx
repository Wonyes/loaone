import { SectionHeader } from "../character/CharacterPage";

interface EmptyCardProps {
  title: string;
  message?: string;
}

export function EmptyCard({ title, message }: EmptyCardProps) {
  return (
    <div className="design-card w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-0">
      <SectionHeader title={title} />
      <div className="flex min-h-[120px] flex-col items-center justify-center p-6">
        <p className="text-center text-sm font-medium text-gray-500">
          {message || `${title} 정보가 없습니다`}
        </p>
      </div>
    </div>
  );
}
