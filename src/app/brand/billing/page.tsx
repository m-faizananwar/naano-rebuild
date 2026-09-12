import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { BillingSummaryCard } from "@/features/payouts/components/billing/BillingSummaryCard";
import { InvoicesTabs } from "@/features/payouts/components/billing/InvoicesTabs";
import { getBillingSummary, getBrandLedger } from "@/features/payouts/server/queries";

export const metadata: Metadata = { title: "Billing · naano" };

export default async function BrandBillingPage() {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login");
  const [summary, ledger] = await Promise.all([getBillingSummary(viewer.brand.id), getBrandLedger(viewer.brand.id)]);
  return (
    <>
      <PageHeader title="Billing" description="Manage your budget, plan and invoices." />
      <div className="grid gap-4">
        <BillingSummaryCard summary={summary} />
        <InvoicesTabs rows={ledger} />
      </div>
    </>
  );
}
