import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { EarningsChart } from "@/features/payouts/components/earnings/EarningsChart";
import { EarningsTiles } from "@/features/payouts/components/earnings/EarningsTiles";
import { RecentActivity } from "@/features/payouts/components/earnings/RecentActivity";
import { WithdrawPanel } from "@/features/payouts/components/earnings/WithdrawPanel";
import { getCreatorLedger, getEarningsByMonth, getEarningsSummary } from "@/features/payouts/server/queries";

export const metadata: Metadata = { title: "Earnings · naano" };

export default async function CreatorEarningsPage() {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login");
  const creatorId = viewer.creator.id;
  const [summary, months, ledger] = await Promise.all([getEarningsSummary(creatorId), getEarningsByMonth(creatorId), getCreatorLedger(creatorId)]);
  return (
    <>
      <PageHeader title="Earnings" description="Track revenue from your paid collaborations and withdraw available funds." />
      <div className="grid gap-4">
        <EarningsTiles summary={summary} />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <EarningsChart months={months} />
          <WithdrawPanel availableCents={summary.availableCents} awaitingReleaseCents={summary.awaitingReleaseCents} />
        </div>
        <RecentActivity rows={ledger} />
      </div>
    </>
  );
}
