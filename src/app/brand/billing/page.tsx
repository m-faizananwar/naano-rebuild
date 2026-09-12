import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { BillingView } from "@/features/payouts/components/billing/BillingView";
import { getBillingSummary, getBrandLedger } from "@/features/payouts/server/queries";
import { parseTopupParam } from "@/features/payouts/schemas";

export const metadata: Metadata = { title: "Billing · naano" };

type Props = { searchParams: Promise<{ topup?: string }> };

// `?topup=<cents>` pre-opens the Add budget dialog with "Suggested for your selection".
export default async function BrandBillingPage({ searchParams }: Props) {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login");
  const [summary, ledger, params] = await Promise.all([getBillingSummary(viewer.brand.id), getBrandLedger(viewer.brand.id), searchParams]);
  return (
    <>
      <PageHeader title="Billing" description="Manage your budget, plan and invoices." />
      <BillingView summary={summary} rows={ledger} suggestedCents={parseTopupParam(params.topup)} />
    </>
  );
}
