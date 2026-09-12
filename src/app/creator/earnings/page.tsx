import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/features/auth/server/session";
import { EarningsChart } from "@/features/payouts/components/earnings/EarningsChart";
import { EarningsTiles } from "@/features/payouts/components/earnings/EarningsTiles";
import { RecentActivity } from "@/features/payouts/components/earnings/RecentActivity";
import { WithdrawDialog } from "@/features/payouts/components/earnings/WithdrawDialog";
import { getCreatorLedger, getEarningsByMonth, getEarningsSummary } from "@/features/payouts/server/queries";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Earnings · ${BRAND.wordmark}` };

export default async function CreatorEarningsPage() {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login");
  const creatorId = viewer.creator.id;
  const [summary, months, ledger] = await Promise.all([getEarningsSummary(creatorId), getEarningsByMonth(creatorId), getCreatorLedger(creatorId)]);
  return (
    <>
      <PageHeader
        title="Earnings"
        description="Track revenue from your paid collaborations and withdraw available funds."
        actions={
          <WithdrawDialog
            availableCents={summary.availableCents}
            awaitingReleaseCents={summary.awaitingReleaseCents}
            triggerClassName={buttonVariants({ className: "bg-brand text-brand-foreground hover:bg-brand/90" })}
            trigger="Withdraw"
          />
        }
      />
      <div className="grid gap-4">
        <EarningsTiles summary={summary} />
        <EarningsChart months={months} />
        <RecentActivity rows={ledger} />
      </div>
    </>
  );
}
