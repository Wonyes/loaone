export default function ShowcaseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="relative h-[280px] animate-pulse bg-white/5" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/5" />
          <div className="space-y-1">
            <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
          </div>
        </div>
        <div className="h-3 w-full animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}
