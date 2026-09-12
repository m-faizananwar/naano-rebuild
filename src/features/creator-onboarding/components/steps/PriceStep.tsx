"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEuroAmount } from "@/lib/format-euro";
import { PRICE_FLOOR_CENTS, recommendPrice } from "@/lib/recommend-price";
import { defaultBundle } from "../../bundles";
import { CENTS_PER_EURO, MAX_BUNDLES, ONBOARDING_STEPS, PRICE_COPY } from "../../constants";
import { type PriceInput, priceSchema } from "../../schemas";
import { savePricing } from "../../server/actions";
import type { OnboardingState } from "../../server/queries";
import { toCardModel } from "../card/toCardModel";
import { INPUT_CLASS } from "../Field";
import { OnboardingSplitLayout } from "../OnboardingSplitLayout";
import { ServerError } from "../ServerError";
import { StepHeader } from "../StepHeader";
import { BundleEditor } from "./BundleEditor";

const PRIMARY = "h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90";
const SECONDARY = "h-12 rounded-xl text-base";

// The stored price is naano's recommendation unless the creator already chose one
// (registration seeds the €20 floor as a placeholder).
function startingPrice(state: OnboardingState, recommended: number) {
  return state.onboarded || state.priceCents !== PRICE_FLOOR_CENTS ? state.priceCents : recommended;
}

function Recommendation({ recommended }: { recommended: number }) {
  return (
    <div className="rounded-2xl border border-brand/20 bg-brand-soft/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">{PRICE_COPY.eyebrow}</p>
      <p className="mt-2 text-sm text-foreground/80">{PRICE_COPY.intro}</p>
      <p className="mt-4 text-4xl font-bold tracking-tight">
        € {formatEuroAmount(recommended)} <span className="text-base font-medium text-muted-foreground">/ post</span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{PRICE_COPY.net}</p>
    </div>
  );
}

// Step 4 of 4: recommended price, editable, optional bundles.
export function PriceStep({ state }: { state: OnboardingState }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const recommended = recommendPrice(state.followers, state.industries, state.engagementRate);
  const form = useForm<PriceInput>({
    resolver: zodResolver(priceSchema),
    defaultValues: { priceCents: startingPrice(state, recommended), bundles: state.bundles },
  });
  const bundles = useFieldArray({ control: form.control, name: "bundles" });
  const { errors, isSubmitting } = form.formState;
  const live = form.watch();
  const hasBundles = bundles.fields.length > 0;

  async function onSubmit(values: PriceInput) {
    setServerError(null);
    const result = await savePricing(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(ONBOARDING_STEPS.professional.path);
  }

  function addBundle() {
    if (bundles.fields.length < MAX_BUNDLES) bundles.append(defaultBundle(live.priceCents || recommended));
  }

  const firstBundle = live.bundles[0];
  const cardBundle = firstBundle && firstBundle.posts > 0 && firstBundle.totalCents > 0 ? firstBundle : null;

  return (
    <OnboardingSplitLayout card={toCardModel(state, { priceCents: live.priceCents || null, bundle: cardBundle, country: state.country })}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <StepHeader step={ONBOARDING_STEPS.price.step} title={ONBOARDING_STEPS.price.title} back={{ href: ONBOARDING_STEPS.card.path, label: "Back to my card" }} />
        <Recommendation recommended={recommended} />
        <div className="grid gap-1.5">
          <label htmlFor="priceCents" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your net price per post
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">€</span>
            <Controller
              control={form.control}
              name="priceCents"
              render={({ field }) => (
                <Input
                  id="priceCents"
                  type="number"
                  inputMode="decimal"
                  min={PRICE_FLOOR_CENTS / CENTS_PER_EURO}
                  step={1}
                  className={`${INPUT_CLASS} pl-8`}
                  value={field.value / CENTS_PER_EURO}
                  onChange={(e) => field.onChange(Math.round(Number(e.target.value) * CENTS_PER_EURO))}
                />
              )}
            />
          </div>
          {errors.priceCents?.message ? <p className="text-sm text-destructive" role="alert">{errors.priceCents.message}</p> : null}
        </div>
        {bundles.fields.map((field, index) => (
          <BundleEditor
            key={field.id}
            index={index}
            control={form.control}
            bundle={live.bundles[index] ?? field}
            priceCents={live.priceCents}
            errors={errors.bundles}
            onRemove={() => bundles.remove(index)}
          />
        ))}
        <ServerError message={serverError} />
        <Button type="submit" size="lg" disabled={isSubmitting} className={PRIMARY}>
          {isSubmitting ? "Creating your profile…" : hasBundles ? PRICE_COPY.confirm : PRICE_COPY.create}
        </Button>
        {bundles.fields.length < MAX_BUNDLES ? (
          <Button type="button" size="lg" variant="outline" onClick={addBundle} className={SECONDARY}>
            {hasBundles ? PRICE_COPY.addAnother : PRICE_COPY.addBundle}
          </Button>
        ) : null}
      </form>
    </OnboardingSplitLayout>
  );
}
