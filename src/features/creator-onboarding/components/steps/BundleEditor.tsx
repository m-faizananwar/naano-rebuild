"use client";

import { Trash2 } from "lucide-react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatEuroAmount } from "@/lib/format-euro";
import { bundleSummary } from "../../bundles";
import { CENTS_PER_EURO } from "../../constants";
import type { PriceInput } from "../../schemas";
import { INPUT_CLASS } from "../Field";

const ORDINALS = ["Primary", "Second", "Third"];

type Props = {
  index: number;
  control: Control<PriceInput>;
  bundle: PriceInput["bundles"][number];
  priceCents: number;
  errors?: FieldErrors<PriceInput>["bundles"];
  onRemove: () => void;
};

// "PRIMARY BUNDLE — Number of posts [5] · Total net price [€1340]" → "€268/post · brand saves €235".
export function BundleEditor({ index, control, bundle, priceCents, errors, onRemove }: Props) {
  const summary = bundleSummary(bundle, priceCents);
  const bundleErrors = errors?.[index];
  const label = ORDINALS[index] ?? `Bundle ${index + 1}`;
  return (
    <fieldset className="relative grid gap-3 rounded-xl border bg-muted/30 p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-brand">{label} bundle</legend>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label.toLowerCase()} bundle`}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor={`bundle-${index}-posts`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Number of posts
          </label>
          <Controller
            control={control}
            name={`bundles.${index}.posts`}
            render={({ field }) => (
              <Input id={`bundle-${index}-posts`} type="number" inputMode="numeric" min={2} step={1} className={INPUT_CLASS} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
            )}
          />
          {bundleErrors?.posts?.message ? <p className="text-sm text-destructive" role="alert">{bundleErrors.posts.message}</p> : null}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={`bundle-${index}-total`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total net price
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">€</span>
            <Controller
              control={control}
              name={`bundles.${index}.totalCents`}
              render={({ field }) => (
                <Input
                  id={`bundle-${index}-total`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={1}
                  className={`${INPUT_CLASS} pl-8`}
                  value={field.value / CENTS_PER_EURO}
                  onChange={(e) => field.onChange(Math.round(Number(e.target.value) * CENTS_PER_EURO))}
                />
              )}
            />
          </div>
          {bundleErrors?.totalCents?.message ? <p className="text-sm text-destructive" role="alert">{bundleErrors.totalCents.message}</p> : null}
        </div>
      </div>
      <p className="text-sm font-medium" aria-live="polite">
        €{formatEuroAmount(summary.perPostCents)}/post · brand saves €{formatEuroAmount(summary.savedCents)}
      </p>
    </fieldset>
  );
}
