import { Bone } from "./Bone";

// Layout-matched skeletons for every data-bound block. Same box, same
// rhythm as the real component, so the 240ms crossfade lands in place.

export function StatTilesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading numbers">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border bg-background p-5">
          <Bone className="h-3 w-24" />
          <Bone className="mt-3 h-8 w-20" />
          <Bone className="mt-2 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function CreatorCardSkeleton() {
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border bg-background p-4">
      <div className="flex flex-col items-center gap-2">
        <Bone className="size-16 rounded-full" />
        <Bone className="h-4 w-32" />
        <Bone className="h-3 w-44" />
      </div>
      <div className="grid grid-cols-4 divide-x rounded-xl border">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 px-2 py-3">
            <Bone className="h-4 w-10" />
            <Bone className="h-2.5 w-12" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Bone className="h-8 flex-1 rounded-lg" />
        <Bone className="h-8 w-20 rounded-lg" />
      </div>
    </article>
  );
}

export function CreatorGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading creators">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex"><CreatorCardSkeleton /></li>
      ))}
    </ul>
  );
}

export function CampaignCardSkeleton() {
  return (
    <article className="flex flex-col rounded-2xl border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <Bone className="h-5 w-40" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>
      <Bone className="mt-3 h-3 w-full" />
      <Bone className="mt-2 h-3 w-4/5" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (<div key={i}><Bone className="h-5 w-12" /><Bone className="mt-1.5 h-2.5 w-16" /></div>))}
      </div>
      <Bone className="mt-5 h-8 w-28 rounded-lg" />
    </article>
  );
}

export function CampaignsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading campaigns">
      {Array.from({ length: count }, (_, i) => <CampaignCardSkeleton key={i} />)}
    </div>
  );
}

export function TableSkeleton({ columns = 6, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background" aria-busy="true" aria-label="Loading rows">
      <div className="grid gap-4 border-b bg-muted/40 px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }, (_, i) => <Bone key={i} className="h-3 w-16" />)}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid gap-4 border-b px-4 py-3.5 last:border-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, c) => <Bone key={c} className={c === 0 ? "h-4 w-32" : "h-4 w-20"} />)}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border bg-background p-5" aria-busy="true" aria-label="Loading chart">
      <div className="flex items-center justify-between">
        <div><Bone className="h-5 w-32" /><Bone className="mt-2 h-3 w-48" /></div>
        <Bone className="h-8 w-40 rounded-lg" />
      </div>
      <div className="mt-4 flex h-64 items-end gap-2 px-2">
        {[35, 55, 40, 70, 60, 85, 50, 65, 45, 75, 58, 80].map((h, i) => <Bone key={i} className="flex-1 rounded-sm" style={{ height: `${h}%` }} />)}
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-background">
      <Bone className="h-24 rounded-none" />
      <div className="p-4">
        <Bone className="h-5 w-40" />
        <Bone className="mt-2 h-3 w-full" />
        <Bone className="mt-1.5 h-3 w-3/4" />
        <div className="mt-4 flex items-center justify-between">
          <Bone className="h-6 w-20" />
          <Bone className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </article>
  );
}

export function OpportunitiesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading opportunities">
      {Array.from({ length: count }, (_, i) => <OpportunityCardSkeleton key={i} />)}
    </div>
  );
}

export function LiveCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-card shadow-xl ring-1 ring-border/60" aria-busy="true" aria-label="Loading card">
      <Bone className="h-32 rounded-none" />
      <div className="flex flex-col items-center px-6 pb-2">
        <Bone className="-mt-10 size-20 rounded-full ring-4 ring-card" />
        <Bone className="mt-4 h-6 w-36" />
        <Bone className="mt-2 h-3 w-24" />
        <Bone className="mt-3 h-3 w-56" />
        <Bone className="mt-5 h-1 w-full" />
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x border-t">
        {Array.from({ length: 3 }, (_, i) => (<div key={i} className="flex flex-col items-center px-2 py-5"><Bone className="h-6 w-14" /><Bone className="mt-2 h-2.5 w-16" /></div>))}
      </div>
    </div>
  );
}

export function TimelineSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="rounded-2xl border bg-background p-5" aria-busy="true" aria-label="Loading timeline">
      <Bone className="h-3 w-16" />
      <ol className="mt-4 space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="relative flex gap-3 pl-5">
            <Bone className="absolute top-1.5 left-0 size-2.5 rounded-full" />
            <div className="flex-1"><Bone className="h-4 w-48" /><Bone className="mt-2 h-3 w-28" /></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ProfileModalSkeleton() {
  return (
    <div className="grid gap-6 p-6 sm:grid-cols-[14rem_1fr]" aria-busy="true" aria-label="Loading profile">
      <div className="flex flex-col items-center gap-3">
        <Bone className="size-24 rounded-full" />
        <Bone className="h-5 w-32" />
        <Bone className="h-3 w-40" />
        <Bone className="mt-2 h-9 w-full rounded-lg" />
      </div>
      <div>
        <div className="flex gap-2">{Array.from({ length: 3 }, (_, i) => <Bone key={i} className="h-8 w-24 rounded-full" />)}</div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="mt-4 grid grid-cols-[8rem_1fr_2.5rem] items-center gap-2"><Bone className="h-3 w-24" /><Bone className="h-2 w-full rounded-full" /><Bone className="h-3 w-8" /></div>
        ))}
      </div>
    </div>
  );
}
