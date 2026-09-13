import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { TimelineSkeleton, TableSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading collaboration">
      <PageHeaderSkeleton withActions />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><TableSkeleton columns={2} rows={5} /><TimelineSkeleton /></div>
    </div>
  );
}
