"use client";

import { CreditCard, Landmark } from "lucide-react";
import type { PayoutMethod } from "../../constants";

const METHODS = [
  { key: "bank", title: "Bank transfer", icon: Landmark, lines: ["No account holder on file", "No bank details on file"], action: "Edit" },
  { key: "stripe", title: "Stripe", icon: CreditCard, lines: ["Status: Not connected", "Instant transfer to your connected Stripe account."], action: "Connect Stripe" },
] as const;

// The two payout rails from creator-26. Neither is wired: the secondary
// actions are labelled but disabled, the withdrawal itself is the demo rail.
export function PayoutMethodRadio({ value, onChange }: { value: PayoutMethod; onChange: (method: PayoutMethod) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payout method</p>
      <div role="radiogroup" aria-label="Payout method" className="mt-2 grid gap-2">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={value === m.key}
            onClick={() => onChange(m.key)}
            className="grid gap-1 rounded-xl border p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-checked:border-brand aria-checked:bg-brand/5"
          >
            <span className="flex items-center gap-2 font-medium">
              <span className={`size-3.5 rounded-full border-2 ${value === m.key ? "border-brand bg-brand" : "border-muted-foreground/50"}`} aria-hidden="true" />
              <m.icon className="size-4" aria-hidden="true" />
              {m.title}
            </span>
            {m.lines.map((line) => (
              <span key={line} className="block text-xs text-muted-foreground">{line}</span>
            ))}
            <span className="mt-1 w-fit rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground" title="Not part of this build">
              {m.action}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
