import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PriceStep } from "@/features/creator-onboarding/components/steps/PriceStep";
import { ONBOARDING_STEPS } from "@/features/creator-onboarding/constants";
import { requireOnboardingCreator } from "@/features/creator-onboarding/server/viewer";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Set your price · ${BRAND.wordmark}` };

export default async function PriceStepPage() {
  const state = await requireOnboardingCreator(ONBOARDING_STEPS.price.path);
  if (!state.profileRead) redirect(ONBOARDING_STEPS.linkedin.path);
  if (!state.cardCompleted) redirect(ONBOARDING_STEPS.card.path);
  return <PriceStep state={state} />;
}
