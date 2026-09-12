import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Billing · naano" };

export default function BrandBillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Manage your budget, plan and invoices." />
      <EmptyState
        title="No invoices or entries yet"
        body="Top-ups and bookings will be listed here with their references."
        cta={{ href: "/brand/campaigns", label: "Plan a campaign" }}
      />
    </>
  );
}
