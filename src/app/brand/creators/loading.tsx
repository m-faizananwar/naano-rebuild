import { Skeleton } from "@/components/ui/skeleton";

const CARDS = 6;

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading creators">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-6 h-9 w-72 rounded-lg" />
      <Skeleton className="mt-6 h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: CARDS }, (_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
