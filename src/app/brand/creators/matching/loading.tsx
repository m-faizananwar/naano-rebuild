import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading AI Matching">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-6 h-9 w-72 rounded-lg" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_16rem]">
        <div>
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="mt-5 h-28 rounded-2xl" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-7 w-40 rounded-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}
