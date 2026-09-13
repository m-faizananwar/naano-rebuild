import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { StatTilesSkeleton, TableSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading overview">
      <PageHeaderSkeleton withActions />
      <div className="mt-8"><StatTilesSkeleton /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]"><TableSkeleton columns={2} rows={4} /><TableSkeleton columns={3} rows={5} /></div>
    </div>
  );
}
