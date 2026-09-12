import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 6;

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading collaborations">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-6 flex gap-3 border-b pb-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-6 w-24" />
        ))}
      </div>
      <div className="mt-4 rounded-2xl border bg-background p-4">
        {Array.from({ length: ROWS }, (_, i) => (
          <Skeleton key={i} className="my-3 h-6 w-full" />
        ))}
      </div>
    </div>
  );
}
