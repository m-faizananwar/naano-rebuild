"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES, COUNTRY_CODES, ONBOARDING_STEPS } from "../../constants";
import { type CardInput, cardSchema } from "../../schemas";
import { saveCreatorCard } from "../../server/actions";
import type { OnboardingState } from "../../server/queries";
import { toCardModel } from "../card/toCardModel";
import { Field, INPUT_CLASS, SELECT_CLASS } from "../Field";
import { IndustryChips } from "../IndustryChips";
import { OnboardingSplitLayout } from "../OnboardingSplitLayout";
import { ServerError } from "../ServerError";
import { StepHeader } from "../StepHeader";

const SUBMIT = "h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90";

function defaultCountry(state: OnboardingState): CardInput["country"] {
  const known = COUNTRY_CODES.find((c) => c === state.country.toUpperCase());
  return known ?? COUNTRY_CODES[0];
}

function defaultIndustries(state: OnboardingState): CardInput["industries"] {
  const parsed = cardSchema.shape.industries.safeParse(state.industries);
  return parsed.success ? parsed.data : [];
}

// Step 3 of 4: followers + headline from LinkedIn, country confirm, industries.
export function CardStep({ state }: { state: OnboardingState }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CardInput>({
    resolver: zodResolver(cardSchema),
    defaultValues: { headline: state.headline, country: defaultCountry(state), industries: defaultIndustries(state) },
  });
  const { errors, isSubmitting } = form.formState;
  const live = form.watch();
  const step = ONBOARDING_STEPS.card;

  async function onSubmit(values: CardInput) {
    setServerError(null);
    const result = await saveCreatorCard(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(ONBOARDING_STEPS.price.path);
  }

  return (
    <OnboardingSplitLayout card={toCardModel(state, { headline: live.headline, country: live.country, industries: live.industries })}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <StepHeader step={step.step} title={step.title} back={{ href: ONBOARDING_STEPS.linkedin.path, label: "Back to my LinkedIn profile" }} />
        <Field id="followers" label="Followers" hint="Imported from your public profile.">
          <Input id="followers" readOnly value={state.followers.toLocaleString("en-US")} className={`${INPUT_CLASS} bg-muted/60`} />
        </Field>
        <Field id="headline" label="Headline" error={errors.headline?.message} hint="Auto-filled from LinkedIn. Edit it if you like.">
          <Input id="headline" className={INPUT_CLASS} {...form.register("headline")} />
        </Field>
        <Field id="country" label="Country" error={errors.country?.message}>
          <select id="country" className={SELECT_CLASS} {...form.register("country")}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Controller
          control={form.control}
          name="industries"
          render={({ field }) => <IndustryChips value={field.value} onChange={field.onChange} error={errors.industries?.message} />}
        />
        <ServerError message={serverError} />
        <Button type="submit" size="lg" disabled={isSubmitting} className={SUBMIT}>
          {isSubmitting ? "Saving…" : "Continue"}
        </Button>
      </form>
    </OnboardingSplitLayout>
  );
}
