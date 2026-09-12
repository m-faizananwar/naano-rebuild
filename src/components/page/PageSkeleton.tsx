import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 5;

// Header + stat tiles + a table-ish block: the shape most screens take while loading.
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="mt-6 rounded-2xl border bg-background p-4">
        {Array.from({ length: ROWS }, (_, i) => (
          <Skeleton key={i} className="my-3 h-5 w-full" />
        ))}
      </div>
    </div>
  );
}
