"use client";

import { Landmark, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@/components/shell/WalletProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCents } from "@/lib/money";
import { MIN_WITHDRAWAL_CENTS, type PayoutMethod } from "../../constants";
import { withdrawEarnings } from "../../server/actions";
import { PayoutMethodRadio } from "./PayoutMethodRadio";

const CENTS = 100;

type Props = { availableCents: number; awaitingReleaseCents: number; trigger: ReactNode; triggerClassName?: string };

// "Withdraw earnings" as naano shows it (creator-26): payout method, amount +
// Withdraw all, Confirm withdrawal, the awaiting-release note. Demo rail.
export function WithdrawDialog({ availableCents, awaitingReleaseCents, trigger, triggerClassName }: Props) {
  const router = useRouter();
  const wallet = useWallet(availableCents);
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PayoutMethod>("stripe");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const cents = Math.round(Number(amount || 0) * CENTS);
  const canSubmit = cents >= MIN_WITHDRAWAL_CENTS && cents <= availableCents && !pending;

  async function submit() {
    setPending(true);
    const before = wallet.walletCents;
    wallet.setWalletCents(before - cents);
    const result = await withdrawEarnings({ amountCents: cents, method });
    setPending(false);
    if (!result.ok) {
      wallet.setWalletCents(before);
      toast.error(result.error);
      return;
    }
    toast.success(`${formatCents(cents, "EUR")} on its way · ${formatCents(result.data.availableCents, "EUR")} left`);
    setAmount("");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClassName}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw earnings</DialogTitle>
          <DialogDescription>Choose where your available balance should be sent.</DialogDescription>
        </DialogHeader>
        <PayoutMethodRadio value={method} onChange={setMethod} />
        <div className="grid gap-2">
          <Label htmlFor="withdraw-amount">Amount (€) · {formatCents(availableCents, "EUR")} available</Label>
          <div className="flex gap-2">
            <Input id="withdraw-amount" type="number" min={MIN_WITHDRAWAL_CENTS / CENTS} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <Button type="button" variant="glass" onClick={() => setAmount((availableCents / CENTS).toFixed(2))} disabled={availableCents <= 0}>
              Withdraw all
            </Button>
          </div>
          <Button type="button" onClick={submit} disabled={!canSubmit} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {pending ? "Confirming…" : "Confirm withdrawal"}
          </Button>
          <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <Wallet className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {awaitingReleaseCents > 0
              ? `${formatCents(awaitingReleaseCents, "EUR")} is waiting for release: it becomes available when the brand pays.`
              : "No earnings are currently waiting for release."}
          </p>
          <Link href="/creator/settings" className={buttonVariants({ variant: "ghost", size: "sm", className: "justify-start text-muted-foreground" })}>
            <Landmark aria-hidden="true" /> Payout details live in Settings › Payments
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
