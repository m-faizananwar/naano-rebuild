import { redirect } from "next/navigation";
import { ONBOARDING_ROUTES } from "@/features/brand-onboarding/constants";
import { requireOnboardingBrand } from "@/features/brand-onboarding/server/require-onboarding-brand";

// /onboarding/brand is only an entry point: step 1 lives at /website.
export default async function BrandOnboardingIndexPage() {
  await requireOnboardingBrand(ONBOARDING_ROUTES.index);
  redirect(ONBOARDING_ROUTES.website);
}
