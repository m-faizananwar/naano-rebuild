import { Skeleton } from "@/components/ui/skeleton";

const FIELDS = 3;

// Mirrors OnboardingSplitLayout while the page resolves the viewer and state.
export function OnboardingSkeleton() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2" aria-busy="true" aria-label="Loading">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-20 xl:px-28">
        <div className="flex flex-1 flex-col py-6 lg:justify-center">
          <div className="w-full max-w-md">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-16 h-3 w-20" />
            <Skeleton className="mt-3 h-9 w-72 max-w-full" />
            <Skeleton className="mt-3 h-4 w-full" />
            <div className="mt-8 grid gap-5">
              {Array.from({ length: FIELDS }, (_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <aside className="flex flex-col items-center bg-brand-soft/60 px-6 pb-16 pt-12 lg:px-12 lg:pt-16">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-4 h-8 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        <Skeleton className="mt-8 h-[28rem] w-full max-w-md rounded-[2rem]" />
      </aside>
    </div>
  );
}
