import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfessionalStep } from "@/features/creator-onboarding/components/steps/ProfessionalStep";
import { ONBOARDING_STEPS } from "@/features/creator-onboarding/constants";
import { requireOnboardingCreator } from "@/features/creator-onboarding/server/viewer";

export const metadata: Metadata = { title: "Complete your professional information · naano" };

export default async function ProfessionalStepPage() {
  const state = await requireOnboardingCreator(ONBOARDING_STEPS.professional.path);
  if (!state.profileRead) redirect(ONBOARDING_STEPS.linkedin.path);
  if (!state.cardCompleted) redirect(ONBOARDING_STEPS.card.path);
  return <ProfessionalStep state={state} />;
}
