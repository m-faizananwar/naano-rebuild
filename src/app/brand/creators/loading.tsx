import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { CreatorGridSkeleton } from "@/components/skeleton/Skeletons";
import { Bone } from "@/components/skeleton/Bone";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading creators">
      <PageHeaderSkeleton />
      <div className="mt-5 flex flex-wrap gap-2"><Bone className="h-8 w-64 rounded-lg" /><Bone className="h-8 w-40 rounded-lg" />{Array.from({ length: 3 }, (_, i) => <Bone key={i} className="h-7 w-24 rounded-full" />)}</div>
      <div className="mt-5"><CreatorGridSkeleton /></div>
    </div>
  );
}
