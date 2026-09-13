import { PageHeaderSkeleton } from "@/components/skeleton/PageHeaderSkeleton";
import { LiveCardSkeleton } from "@/components/skeleton/Skeletons";

// Layout-matched skeleton for this route; the page crossfades over it once its data lands.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading card">
      <PageHeaderSkeleton withActions />
      <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]"><LiveCardSkeleton /><div /></div>
    </div>
  );
}
