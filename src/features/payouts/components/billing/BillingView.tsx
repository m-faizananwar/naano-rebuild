"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@/components/shell/WalletProvider";
import { formatCents } from "@/lib/money";
import { TOPUP_PRESETS_CENTS } from "../../constants";
import type { LedgerRowDto } from "../../schemas";
import { topUpWallet } from "../../server/actions";
import type { BillingSummary } from "../../server/queries";
import { AddBudgetDialog } from "./AddBudgetDialog";
import { BillingSummaryCard } from "./BillingSummaryCard";
import { InvoicesTabs } from "./InvoicesTabs";

type Props = { summary: BillingSummary; rows: LedgerRowDto[]; suggestedCents: number | null };

const DEFAULT_PRESET_INDEX = 1;

function optimisticRow(cents: number): LedgerRowDto {
  return { id: `pending-${Date.now()}`, date: new Date().toISOString(), type: "topup", status: "pending", amountCents: cents, reference: "TU-…", description: "Top-up · crediting…" };
}

// Holds the optimistic balance + invoice rows; the wallet chip follows through WalletProvider.
export function BillingView({ summary: initialSummary, rows: initialRows, suggestedCents }: Props) {
  const router = useRouter();
  const wallet = useWallet(initialSummary.balanceCents);
  const [summary, setSummary] = useState(initialSummary);
  const [rows, setRows] = useState(initialRows);
  const [dialog, setDialog] = useState<{ open: boolean; cents: number; suggested: boolean }>({
    open: suggestedCents !== null,
    cents: suggestedCents ?? TOPUP_PRESETS_CENTS[DEFAULT_PRESET_INDEX],
    suggested: suggestedCents !== null,
  });

  function openDialog(presetCents?: number) {
    setDialog({ open: true, cents: presetCents ?? TOPUP_PRESETS_CENTS[DEFAULT_PRESET_INDEX], suggested: false });
  }

  async function submit(cents: number) {
    const before = { summary, rows, wallet: wallet.walletCents };
    const pending = optimisticRow(cents);
    setSummary({ ...summary, balanceCents: summary.balanceCents + cents, topupsCents: summary.topupsCents + cents, entries: summary.entries + 1 });
    setRows([pending, ...rows]);
    wallet.setWalletCents(before.wallet + cents);
    setDialog((d) => ({ ...d, open: false }));
    const result = await topUpWallet({ amountCents: cents });
    if (!result.ok) {
      setSummary(before.summary);
      setRows(before.rows);
      wallet.setWalletCents(before.wallet);
      toast.error(result.error);
      return;
    }
    setRows((current) => current.map((r) => (r.id === pending.id ? result.data.row : r)));
    setSummary((s) => ({ ...s, balanceCents: result.data.balanceCents }));
    wallet.setWalletCents(result.data.balanceCents);
    toast.success(`${formatCents(cents, "EUR")} credited · balance ${formatCents(result.data.balanceCents, "EUR")}`);
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <BillingSummaryCard summary={summary} onAddBudget={openDialog} />
      <InvoicesTabs rows={rows} />
      {dialog.open ? (
        <AddBudgetDialog
          open
          onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
          initialCents={dialog.cents}
          suggested={dialog.suggested}
          currentBalanceCents={summary.balanceCents}
          onSubmit={submit}
        />
      ) : null}
    </div>
  );
}
