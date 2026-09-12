"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES, COUNTRY_CODES, EU_COUNTRY_CODES, ONBOARDING_STEPS, PROFESSIONAL_COPY } from "../../constants";
import { type ProfessionalInput, professionalSchema } from "../../schemas";
import { completeOnboarding, saveProfessionalInfo } from "../../server/actions";
import type { OnboardingState } from "../../server/queries";
import { toCardModel } from "../card/toCardModel";
import { Field, INPUT_CLASS, SELECT_CLASS } from "../Field";
import { OnboardingSplitLayout } from "../OnboardingSplitLayout";
import { ServerError } from "../ServerError";
import { StepHeader } from "../StepHeader";

const PRIMARY = "h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90";
const CHECKBOX = "mt-0.5 size-4 shrink-0 rounded border-input accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

function defaultCountry(state: OnboardingState): ProfessionalInput["legalCountry"] {
  const wanted = (state.professional.legalCountry ?? state.country).toUpperCase();
  return COUNTRY_CODES.find((c) => c === wanted) ?? COUNTRY_CODES[0];
}

function defaults(state: OnboardingState): Partial<ProfessionalInput> {
  const p = state.professional;
  return {
    legalCountry: defaultCountry(state),
    registeredBusiness: p.registeredBusiness ?? false,
    legalName: p.legalName || state.name,
    legalAddress: p.legalAddress,
    taxAcknowledged: p.taxAcknowledged ? true : undefined,
    invoicingAuthorized: p.invoicingAuthorized ? true : undefined,
  };
}

// Optional last screen: professional information for invoicing. Either button completes onboarding.
export function ProfessionalStep({ state }: { state: OnboardingState }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [skipping, setSkipping] = useState(false);
  const form = useForm<ProfessionalInput>({ resolver: zodResolver(professionalSchema), defaultValues: defaults(state) });
  const { errors, isSubmitting } = form.formState;
  const legalCountry = form.watch("legalCountry");
  const copy = EU_COUNTRY_CODES.has(legalCountry) ? PROFESSIONAL_COPY.eu : PROFESSIONAL_COPY.outside;

  async function onSubmit(values: ProfessionalInput) {
    setServerError(null);
    const result = await saveProfessionalInfo(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(result.data.redirectTo);
  }

  async function onSkip() {
    setServerError(null);
    setSkipping(true);
    const result = await completeOnboarding();
    if (!result.ok) {
      setSkipping(false);
      setServerError(result.error);
      return;
    }
    router.push(result.data.redirectTo);
  }

  return (
    <OnboardingSplitLayout card={toCardModel(state, { country: state.country })}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <StepHeader step={ONBOARDING_STEPS.professional.step} title={ONBOARDING_STEPS.professional.title} back={{ href: ONBOARDING_STEPS.price.path, label: "Back to my price" }} />
        <div className="rounded-xl border bg-muted/30 p-4 text-sm">
          <p className="font-medium">{copy.lead}</p>
          <p className="mt-2 text-muted-foreground">{copy.detail}</p>
        </div>
        <Field id="legalCountry" label="Registration country" error={errors.legalCountry?.message}>
          <select id="legalCountry" className={SELECT_CLASS} {...form.register("legalCountry")}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <fieldset className="grid gap-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registered business</legend>
          <div className="flex gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="true" className="accent-brand" checked={form.watch("registeredBusiness") === true} onChange={() => form.setValue("registeredBusiness", true)} />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="false" className="accent-brand" checked={form.watch("registeredBusiness") === false} onChange={() => form.setValue("registeredBusiness", false)} />
              No, I work as an individual
            </label>
          </div>
        </fieldset>
        <Field id="legalName" label="Legal name" error={errors.legalName?.message}>
          <Input id="legalName" autoComplete="organization" className={INPUT_CLASS} {...form.register("legalName")} />
        </Field>
        <Field id="legalAddress" label="Legal address" error={errors.legalAddress?.message}>
          <Textarea id="legalAddress" autoComplete="street-address" rows={3} className="rounded-xl px-4 py-3" {...form.register("legalAddress")} />
        </Field>
        <label className="flex gap-3 text-sm">
          <input type="checkbox" className={CHECKBOX} {...form.register("taxAcknowledged")} />
          <span>{PROFESSIONAL_COPY.tax}</span>
        </label>
        {errors.taxAcknowledged?.message ? <p className="-mt-3 text-sm text-destructive" role="alert">{errors.taxAcknowledged.message}</p> : null}
        <label className="flex gap-3 text-sm">
          <input type="checkbox" className={CHECKBOX} {...form.register("invoicingAuthorized")} />
          <span>{PROFESSIONAL_COPY.invoicing}</span>
        </label>
        {errors.invoicingAuthorized?.message ? <p className="-mt-3 text-sm text-destructive" role="alert">{errors.invoicingAuthorized.message}</p> : null}
        <ServerError message={serverError} />
        <Button type="submit" size="lg" disabled={isSubmitting || skipping} className={PRIMARY}>
          {isSubmitting ? "Saving…" : PROFESSIONAL_COPY.save}
        </Button>
        <Button type="button" size="lg" variant="ghost" disabled={isSubmitting || skipping} onClick={onSkip} className="h-12 rounded-xl text-base">
          {skipping ? "Opening your workspace…" : PROFESSIONAL_COPY.later}
        </Button>
      </form>
    </OnboardingSplitLayout>
  );
}
