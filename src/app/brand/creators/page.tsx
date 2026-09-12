import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Creators · naano" };

export default function BrandCreatorsPage() {
  return (
    <>
      <PageHeader title="Creators" description="All creators are shown from most to least relevant, using sector fit first and verified performance statistics to refine the order." />
      <EmptyState
        title="The marketplace opens in the next build step"
        body="Creator cards with fit %, CPM and median views, filters and a profile modal with the audience snapshot."
        cta={{ href: "/brand/campaigns", label: "See campaigns" }}
      />
    </>
  );
}
