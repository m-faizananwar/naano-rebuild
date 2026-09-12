import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CardStep } from "@/features/creator-onboarding/components/steps/CardStep";
import { ONBOARDING_STEPS } from "@/features/creator-onboarding/constants";
import { requireOnboardingCreator } from "@/features/creator-onboarding/server/viewer";

export const metadata: Metadata = { title: "Complete your creator card · naano" };

export default async function CardStepPage() {
  const state = await requireOnboardingCreator(ONBOARDING_STEPS.card.path);
  if (!state.profileRead) redirect(ONBOARDING_STEPS.linkedin.path);
  return <CardStep state={state} />;
}
