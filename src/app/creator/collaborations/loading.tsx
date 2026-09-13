import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { TableSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading collaborations">
      <PageHeaderSkeleton />
      <div className="mt-8"><TableSkeleton columns={7} rows={8} /></div>
    </div>
  );
}
