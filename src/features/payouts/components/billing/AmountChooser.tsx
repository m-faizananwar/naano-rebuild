"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCents } from "@/lib/money";
import { MIN_TOPUP_CENTS, TOPUP_PRESETS_CENTS } from "../../constants";

const CENTS = 100;

type Props = { cents: number; onChange: (cents: number) => void };

// "CHOOSE AN AMOUNT": four presets or a custom euro amount.
export function AmountChooser({ cents, onChange }: Props) {
  const isPreset = (TOPUP_PRESETS_CENTS as readonly number[]).includes(cents);
  return (
    <fieldset className="grid gap-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choose an amount</legend>
      <div role="radiogroup" aria-label="Preset amounts" className="grid grid-cols-2 gap-2">
        {TOPUP_PRESETS_CENTS.map((preset) => (
          <button
            key={preset}
            type="button"
            role="radio"
            aria-checked={cents === preset}
            onClick={() => onChange(preset)}
            className="rounded-xl border px-3 py-2.5 text-sm font-semibold tabular-nums transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-checked:border-brand aria-checked:bg-brand/5 aria-checked:text-brand"
          >
            {formatCents(preset, "EUR").replace(/\.00$/, "")}
          </button>
        ))}
      </div>
      <div className="grid gap-1">
        <Label htmlFor="topup-custom" className="sr-only">
          Custom amount in euros
        </Label>
        <div className="flex items-center rounded-xl border px-3 focus-within:ring-2 focus-within:ring-brand/40">
          <span className="text-sm text-muted-foreground" aria-hidden="true">€</span>
          <Input
            id="topup-custom"
            type="number"
            inputMode="numeric"
            min={MIN_TOPUP_CENTS / CENTS}
            step="1"
            placeholder="Custom amount"
            value={isPreset ? "" : cents > 0 ? String(cents / CENTS) : ""}
            onChange={(e) => onChange(Math.round(Number(e.target.value || 0) * CENTS))}
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <p className="text-xs text-muted-foreground">Minimum {formatCents(MIN_TOPUP_CENTS, "EUR").replace(/\.00$/, "")} · credited right after payment</p>
      </div>
    </fieldset>
  );
}
