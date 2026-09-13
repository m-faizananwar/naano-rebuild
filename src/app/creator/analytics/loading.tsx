import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { StatTilesSkeleton, ChartSkeleton, TableSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading analytics">
      <PageHeaderSkeleton />
      <div className="mt-8"><StatTilesSkeleton /></div>
      <div className="mt-6"><ChartSkeleton /></div>
      <div className="mt-6"><TableSkeleton columns={6} rows={6} /></div>
    </div>
  );
}
