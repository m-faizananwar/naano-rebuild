"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCents } from "@/lib/money";
import { Liquid } from "liquid-gooey";
import { MIN_TOPUP_CENTS, TOPUP_PRESETS_CENTS } from "../../constants";

const CENTS = 100;

type Props = { cents: number; onChange: (cents: number) => void };

// "CHOOSE AN AMOUNT": four presets or a custom euro amount.
export function AmountChooser({ cents, onChange }: Props) {
  const isPreset = (TOPUP_PRESETS_CENTS as readonly number[]).includes(cents);
  return (
    <fieldset className="grid gap-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choose an amount</legend>
      {/* The four presets are liquid-gooey items: the selected chip and a hovered
          neighbour merge like goo, and a chip bows (effect "bend") as it lifts on hover. */}
      <Liquid role="radiogroup" aria-label="Preset amounts" blur={6} contrast={18} fill="var(--color-muted)" className="grid grid-cols-2 gap-2">
        {TOPUP_PRESETS_CENTS.map((preset) => (
          <Liquid.Item key={preset} effect="bend" bend={{ vertical: 0.6, horizontal: 0.35 }}>
            <button
              type="button"
              role="radio"
              aria-checked={cents === preset}
              onClick={() => onChange(preset)}
              className="preset-chip w-full rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-sm font-semibold tabular-nums transition-[transform,color] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-checked:border-brand aria-checked:text-brand motion-reduce:hover:translate-y-0"
            >
              {formatCents(preset, "EUR").replace(/\.00$/, "")}
            </button>
          </Liquid.Item>
        ))}
      </Liquid>
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
