"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LinkedinProfile } from "@/lib/linkedin-profile";
import { LINKEDIN_COPY, ONBOARDING_STEPS } from "../../constants";
import { type LinkedinInput, linkedinSchema } from "../../schemas";
import { readLinkedinProfile } from "../../server/actions";
import type { OnboardingState } from "../../server/queries";
import { type CardOverrides, toCardModel } from "../card/toCardModel";
import { Field, INPUT_CLASS } from "../Field";
import { OnboardingSplitLayout } from "../OnboardingSplitLayout";
import { ServerError } from "../ServerError";
import { StepHeader } from "../StepHeader";

const SUBMIT = "h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90 disabled:bg-brand/60 disabled:opacity-100";

function overridesFor(reading: boolean, found: LinkedinProfile | null): CardOverrides {
  if (found) return { followers: found.followers, medianViews: found.medianViews, headline: found.headline, engagementRate: found.engagementRate };
  return { reading };
}

// Step 2 of 4: one URL, one consent box, a simulated read of the public profile.
export function LinkedinStep({ state }: { state: OnboardingState }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [found, setFound] = useState<LinkedinProfile | null>(null);
  const form = useForm<LinkedinInput>({ resolver: zodResolver(linkedinSchema), defaultValues: { linkedinUrl: state.linkedinUrl } });
  const { errors, isSubmitting } = form.formState;
  const step = ONBOARDING_STEPS.linkedin;

  async function onSubmit(values: LinkedinInput) {
    setServerError(null);
    const result = await readLinkedinProfile(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setFound(result.data);
    router.push(ONBOARDING_STEPS.card.path);
  }

  return (
    <OnboardingSplitLayout card={toCardModel(state, overridesFor(isSubmitting, found))}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <StepHeader step={step.step} title={step.title} intro={LINKEDIN_COPY.intro} back={{ href: "/creator", label: "Back to my account" }} />
        <Field id="linkedinUrl" label="Public LinkedIn profile URL" error={errors.linkedinUrl?.message}>
          <Input id="linkedinUrl" type="url" inputMode="url" autoComplete="url" placeholder="https://www.linkedin.com/in/your-name" className={INPUT_CLASS} {...form.register("linkedinUrl")} />
        </Field>
        <div className="flex gap-3 rounded-xl border border-brand/20 bg-brand-soft/60 p-4 text-sm text-foreground/80">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
          <p>{LINKEDIN_COPY.consent}</p>
        </div>
        <ServerError message={serverError} />
        {found ? (
          <p className="text-sm text-muted-foreground" role="status">
            Profile found: <span className="font-semibold text-foreground">{found.name}</span> · {found.followers.toLocaleString("en-US")} followers
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={isSubmitting || found !== null} className={SUBMIT}>
          {isSubmitting || found ? LINKEDIN_COPY.reading : LINKEDIN_COPY.submit}
        </Button>
        {state.profileRead && !found ? (
          <p className="text-center text-xs text-muted-foreground">
            Profile already read.{" "}
            <Link href={ONBOARDING_STEPS.card.path} className="font-semibold text-brand hover:underline">
              Keep my current profile
            </Link>
          </p>
        ) : null}
      </form>
    </OnboardingSplitLayout>
  );
}
