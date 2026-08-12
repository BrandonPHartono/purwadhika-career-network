function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-2 w-48" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-3">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-5 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );
}
