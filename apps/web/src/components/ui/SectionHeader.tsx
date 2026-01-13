export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-white/10 bg-slate-900/30 p-4">
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}
