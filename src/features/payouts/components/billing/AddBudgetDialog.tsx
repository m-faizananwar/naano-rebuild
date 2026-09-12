"use client";

import { CreditCard, Lock, PackageCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCents } from "@/lib/money";
import { MIN_TOPUP_CENTS } from "../../constants";
import { AmountChooser } from "./AmountChooser";

const REASSURANCE = [
  { icon: CreditCard, title: "Card payment", body: "entered only on Stripe's secure checkout (PCI DSS)." },
  { icon: ShieldCheck, title: "No subscription", body: "funds stay in your Naano balance until used." },
  { icon: PackageCheck, title: "Pay on delivery", body: "creators are charged only after the post is delivered." },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCents: number;
  suggested: boolean;
  currentBalanceCents: number;
  onSubmit: (cents: number) => Promise<void>;
};

function euros(cents: number) {
  return formatCents(cents, "EUR").replace(/\.00$/, "");
}

// naano's "SECURE PAYMENT / Add budget" dialog, verbatim. The CTA credits the
// ledger directly: there is no Stripe checkout in this build and the dialog says so.
export function AddBudgetDialog({ open, onOpenChange, initialCents, suggested, currentBalanceCents, onSubmit }: Props) {
  const [cents, setCents] = useState(initialCents);
  const [pending, setPending] = useState(false);
  const valid = cents >= MIN_TOPUP_CENTS;

  async function submit() {
    if (!valid || pending) return;
    setPending(true);
    await onSubmit(cents);
    setPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Secure payment</p>
          <DialogTitle className="text-xl">Add budget</DialogTitle>
          <DialogDescription>One-time deposit to your Naano balance. Use it across all campaigns — no subscription.</DialogDescription>
        </DialogHeader>
        <p className="w-fit rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          No card — demo top-up
        </p>
        {suggested ? (
          <p className="rounded-lg bg-brand/5 px-3 py-2 text-xs">
            <span className="font-semibold">Suggested for your selection</span> — Covers the creators you picked. Adjust below if needed.
          </p>
        ) : null}
        <AmountChooser cents={cents} onChange={setCents} />
        <dl className="grid gap-1 rounded-xl bg-muted px-3 py-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">You will credit</dt>
            <dd className="font-semibold tabular-nums">{euros(valid ? cents : 0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Current balance</dt>
            <dd className="tabular-nums">{euros(currentBalanceCents)}</dd>
          </div>
        </dl>
        <ul className="grid gap-2 text-xs text-muted-foreground">
          {REASSURANCE.map((r) => (
            <li key={r.title} className="flex gap-2">
              <r.icon className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">{r.title}</span> — {r.body}
              </span>
            </li>
          ))}
        </ul>
        <Button type="button" onClick={submit} disabled={!valid || pending} className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
          {pending ? "Crediting…" : `Add ${euros(valid ? cents : MIN_TOPUP_CENTS)}`}
        </Button>
        <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
          <Lock className="size-3" aria-hidden="true" /> End-to-end encrypted · powered by Stripe
        </p>
      </DialogContent>
    </Dialog>
  );
}
