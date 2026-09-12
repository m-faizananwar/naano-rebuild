import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Earnings · naano" };

export default function CreatorEarningsPage() {
  return (
    <>
      <PageHeader title="Earnings" description="Track revenue from your paid collaborations and withdraw available funds." />
      <EmptyState
        title="No movements yet"
        body="Your first payment will appear here."
        cta={{ href: "/creator/opportunities", label: "Find a campaign" }}
      />
    </>
  );
}
