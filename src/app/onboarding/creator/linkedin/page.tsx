import type { Metadata } from "next";
import { LinkedinStep } from "@/features/creator-onboarding/components/steps/LinkedinStep";
import { ONBOARDING_STEPS } from "@/features/creator-onboarding/constants";
import { requireOnboardingCreator } from "@/features/creator-onboarding/server/viewer";

export const metadata: Metadata = { title: "Add your public LinkedIn profile · naano" };

export default async function LinkedinStepPage() {
  const state = await requireOnboardingCreator(ONBOARDING_STEPS.linkedin.path);
  return <LinkedinStep state={state} />;
}
