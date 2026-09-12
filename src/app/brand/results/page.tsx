import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Results · naano" };

export default function BrandResultsPage() {
  return (
    <>
      <PageHeader title="Results" description="Est. reach, qualified clicks and committed budget across your campaigns." />
      <EmptyState
        title="No published posts yet"
        body="Results appear as soon as a creator's post goes live and the tracked link gets its first click."
        cta={{ href: "/brand/collaborations", label: "See collaborations" }}
      />
    </>
  );
}
