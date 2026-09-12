import { redirect } from "next/navigation";
import { ONBOARDING_STEPS } from "@/features/creator-onboarding/constants";
import { requireOnboardingCreator } from "@/features/creator-onboarding/server/viewer";

// Step 1 of 4 is the account form at /register/creator; a signed-in creator
// starts at step 2.
export default async function CreatorOnboardingIndexPage() {
  await requireOnboardingCreator(ONBOARDING_STEPS.linkedin.path);
  redirect(ONBOARDING_STEPS.linkedin.path);
}
