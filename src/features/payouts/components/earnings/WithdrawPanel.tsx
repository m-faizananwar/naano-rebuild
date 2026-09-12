"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCents } from "@/lib/money";
import { MIN_WITHDRAWAL_CENTS, type PayoutMethod } from "../../constants";
import { withdrawEarnings } from "../../server/actions";

const CENTS = 100;

export function WithdrawPanel({ availableCents, awaitingReleaseCents }: { availableCents: number; awaitingReleaseCents: number }) {
  const router = useRouter();
  const [method, setMethod] = useState<PayoutMethod>("stripe");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const cents = Math.round(Number(amount || 0) * CENTS);
  const canSubmit = cents >= MIN_WITHDRAWAL_CENTS && cents <= availableCents && !pending;

  async function submit() {
    setPending(true);
    const result = await withdrawEarnings({ amountCents: cents, method });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${formatCents(cents, "EUR")} on its way · ${formatCents(result.data.availableCents, "EUR")} left`);
    setAmount("");
    router.refresh();
  }

  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="font-semibold">Withdraw earnings</h2>
      <p className="text-sm text-muted-foreground">Choose where your available balance should be sent.</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payout method</p>
      <div role="radiogroup" aria-label="Payout method" className="mt-2 grid gap-2">
        {(
          [
            { key: "bank", title: "Bank transfer", body: "No account holder on file · No bank details on file" },
            { key: "stripe", title: "Stripe", body: "Status: Demo rail · Instant transfer to your connected Stripe account." },
          ] as const
        ).map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={method === m.key}
            onClick={() => setMethod(m.key)}
            className="rounded-xl border p-3 text-left transition-colors hover:bg-muted aria-checked:border-brand aria-checked:bg-brand/5"
          >
            <span className="block font-medium">{m.title}</span>
            <span className="block text-xs text-muted-foreground">{m.body}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        <Label htmlFor="withdraw-amount">Amount (€)</Label>
        <div className="flex gap-2">
          <Input id="withdraw-amount" type="number" min={MIN_WITHDRAWAL_CENTS / CENTS} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
          <Button type="button" variant="outline" onClick={() => setAmount((availableCents / CENTS).toFixed(2))} disabled={availableCents <= 0}>
            Withdraw all
          </Button>
        </div>
        <Button type="button" onClick={submit} disabled={!canSubmit} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {pending ? "Confirming…" : "Confirm withdrawal"}
        </Button>
        <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          {awaitingReleaseCents > 0
            ? `${formatCents(awaitingReleaseCents, "EUR")} is waiting for release: it becomes available when the brand pays.`
            : "No earnings are currently waiting for release."}
        </p>
      </div>
    </section>
  );
}
