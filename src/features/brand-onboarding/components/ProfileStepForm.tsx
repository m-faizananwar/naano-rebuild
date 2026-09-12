"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { COPY, ICP_COUNT, ONBOARDING_ROUTES, WELCOME_PARAMS } from "../constants";
import { type OnboardingProfileDto, type ProfileInput, profileSchema } from "../schemas";
import { completeOnboarding } from "../server/actions";
import { IcpCardFields } from "./IcpCardFields";
import { StarterBriefPreview } from "./StarterBriefPreview";
import { ValuePropField } from "./ValuePropField";

type Props = { profile: OnboardingProfileDto; readFailed: boolean };

function defaultIcps(profile: OnboardingProfileDto) {
  const icps = profile.icps.slice(0, ICP_COUNT).map((icp) => ({ title: icp.title, description: icp.description }));
  while (icps.length < ICP_COUNT) icps.push({ title: "", description: "" });
  return icps;
}

function welcomeUrl(campaignId: string) {
  const params = new URLSearchParams({ [WELCOME_PARAMS.campaign]: campaignId, [WELCOME_PARAMS.step]: WELCOME_PARAMS.stepValue });
  return `/brand/creators/matching?${params.toString()}`;
}

export function ProfileStepForm({ profile, readFailed }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { valueProp: profile.valueProp, icps: defaultIcps(profile) },
  });
  const { errors, isSubmitting } = form.formState;
  const [valueProp, icps] = useWatch({ control: form.control, name: ["valueProp", "icps"] });

  async function onSubmit(values: ProfileInput) {
    setServerError(null);
    const result = await completeOnboarding(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setOpening(true);
    router.push(welcomeUrl(result.data.campaignId));
  }

  const busy = isSubmitting || opening;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6" noValidate>
      <ValuePropField register={form.register} errors={errors} readFailedUrl={readFailed ? profile.website : null} />

      <div className="grid gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{COPY.profile.icpsLabel}</h2>
          <p className="text-sm text-muted-foreground">{COPY.profile.icpsHint}</p>
        </div>
        {Array.from({ length: ICP_COUNT }, (_, index) => (
          <IcpCardFields key={index} index={index} register={form.register} errors={errors} />
        ))}
      </div>

      <StarterBriefPreview
        company={profile.company}
        valueProp={valueProp}
        icpTitles={icps.map((icp) => icp.title)}
        industries={profile.targetIndustries}
        regions={profile.targetRegions}
      />

      {serverError ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href={ONBOARDING_ROUTES.website} className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 rounded-xl" })}>
          {COPY.profile.back}
        </Link>
        <Button type="submit" size="lg" disabled={busy} className="h-12 rounded-xl bg-brand text-base font-semibold text-brand-foreground hover:bg-brand/90">
          {busy ? COPY.profile.submitting : COPY.profile.submit}
        </Button>
      </div>
    </form>
  );
}
