import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { OpportunitiesSkeleton } from "@/components/skeleton/Skeletons";
import { Bone } from "@/components/skeleton/Bone";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading opportunities">
      <PageHeaderSkeleton />
      <div className="mt-5 flex flex-wrap gap-2">{Array.from({ length: 4 }, (_, i) => <Bone key={i} className="h-8 w-28 rounded-lg" />)}</div>
      <div className="mt-5"><OpportunitiesSkeleton /></div>
    </div>
  );
}
