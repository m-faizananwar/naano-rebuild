import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { StatTilesSkeleton, LiveCardSkeleton, TableSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading workspace">
      <PageHeaderSkeleton />
      <div className="mt-8"><StatTilesSkeleton /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[20rem_1fr]"><LiveCardSkeleton /><TableSkeleton columns={3} rows={4} /></div>
    </div>
  );
}
