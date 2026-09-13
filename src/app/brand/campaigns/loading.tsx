import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { CampaignsSkeleton, TableSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading campaigns">
      <PageHeaderSkeleton withActions />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"><CampaignsSkeleton /><TableSkeleton columns={1} rows={5} /></div>
    </div>
  );
}
