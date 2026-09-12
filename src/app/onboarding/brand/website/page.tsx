import type { Metadata } from "next";
import { ErrorState } from "@/components/page/ErrorState";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { OnboardingStepHeader } from "@/features/brand-onboarding/components/OnboardingStepHeader";
import { WebsiteStepForm } from "@/features/brand-onboarding/components/WebsiteStepForm";
import { COPY, ONBOARDING_ROUTES } from "@/features/brand-onboarding/constants";
import { loadOnboardingProfile } from "@/features/brand-onboarding/server/queries";
import { requireOnboardingBrand } from "@/features/brand-onboarding/server/require-onboarding-brand";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Your website · ${BRAND.wordmark}` };

export default async function BrandOnboardingWebsitePage() {
  const viewer = await requireOnboardingBrand(ONBOARDING_ROUTES.website);
  const profile = await loadOnboardingProfile(viewer.brand.id);
  return (
    <AuthSplitLayout panelTitle={COPY.panelTitle} panelBody={COPY.panelBody} panelFootnote={COPY.panelFootnote}>
      <OnboardingStepHeader step={1} title={COPY.website.title} sub={COPY.website.sub} />
      <div className="mt-8">
        {profile ? (
          <WebsiteStepForm website={profile.website} onboarded={profile.onboarded} />
        ) : (
          <ErrorState body="Your brand workspace could not be loaded. The database may be unreachable." retryHref={ONBOARDING_ROUTES.website} />
        )}
      </div>
    </AuthSplitLayout>
  );
}
