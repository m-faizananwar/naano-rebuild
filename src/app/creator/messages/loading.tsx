import { Skeleton } from "@/components/ui/skeleton";

const THREADS = 4;

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading messages" className="grid min-h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border bg-background lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="space-y-3 border-r p-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: THREADS }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <div className="hidden p-4 lg:block">
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}
