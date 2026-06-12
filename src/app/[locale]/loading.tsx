function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse motion-reduce:animate-none rounded-xl bg-white/[0.07] ${className}`} />
}

function TopicCardSkeleton() {
  return (
    <section className="rounded-2xl border border-border bg-surface/45 p-5 md:p-7">
      <div className="mb-5 flex items-start gap-4">
        <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-3">
          <SkeletonBlock className="h-6 w-3/4 max-w-[22rem]" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>
      </div>
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-11/12" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </section>
  )
}

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="mx-auto w-full max-w-4xl xl:max-w-[1180px] 2xl:max-w-[1260px]"
    >
      {/* Neutral header — works for the homepage, category, and topic pages */}
      <header className="border-gradient mb-8 overflow-hidden rounded-2xl p-5 shadow-card md:p-7">
        <div className="relative flex flex-col gap-5 md:flex-row md:items-start">
          <SkeletonBlock className="h-14 w-14 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <SkeletonBlock className="h-9 w-64 max-w-full md:h-11 md:w-96" />
              <SkeletonBlock className="h-7 w-24 rounded-lg" />
            </div>
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-full max-w-3xl" />
              <SkeletonBlock className="h-4 w-10/12 max-w-2xl" />
            </div>
            <SkeletonBlock className="mt-4 h-6 w-40 rounded-full" />
          </div>
        </div>
      </header>

      <div className="xl:grid xl:grid-cols-[minmax(760px,1fr)_220px] xl:gap-7 2xl:gap-8 xl:items-start">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-surface/50 to-secondary/10 p-4 shadow-card md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <SkeletonBlock className="h-12 w-12 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3 w-32" />
                <SkeletonBlock className="h-7 w-4/5 max-w-lg" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-32" />
            </div>
            <SkeletonBlock className="mt-4 h-48 rounded-2xl" />
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <TopicCardSkeleton />
            <TopicCardSkeleton />
          </div>
          <TopicCardSkeleton />
        </div>

        <aside className="sticky top-24 hidden xl:block">
          <div className="rounded-2xl border border-border bg-surface/45 p-4">
            <SkeletonBlock className="mb-4 h-5 w-28" />
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-10/12" />
              <SkeletonBlock className="h-3 w-11/12" />
              <SkeletonBlock className="h-3 w-8/12" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
