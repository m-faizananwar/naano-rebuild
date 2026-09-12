import type { Metadata } from "next";
import { ErrorState } from "@/components/page/ErrorState";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { OnboardingStepHeader } from "@/features/brand-onboarding/components/OnboardingStepHeader";
import { ProfileStepForm } from "@/features/brand-onboarding/components/ProfileStepForm";
import { COPY, ONBOARDING_ROUTES } from "@/features/brand-onboarding/constants";
import { loadOnboardingProfile } from "@/features/brand-onboarding/server/queries";
import { requireOnboardingBrand } from "@/features/brand-onboarding/server/require-onboarding-brand";

export const metadata: Metadata = { title: "Value prop & ICP · naano" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function BrandOnboardingProfilePage({ searchParams }: Props) {
  const viewer = await requireOnboardingBrand(ONBOARDING_ROUTES.profile);
  const [profile, params] = await Promise.all([loadOnboardingProfile(viewer.brand.id), searchParams]);
  const readFailed = params.read === "failed";
  return (
    <AuthSplitLayout panelTitle={COPY.panelTitle} panelBody={COPY.panelBody} panelFootnote={COPY.panelFootnote}>
      <OnboardingStepHeader step={2} title={COPY.profile.title} sub={COPY.profile.sub} />
      <div className="mt-8">
        {profile ? (
          <ProfileStepForm profile={profile} readFailed={readFailed} />
        ) : (
          <ErrorState body="Your brand workspace could not be loaded. The database may be unreachable." retryHref={ONBOARDING_ROUTES.profile} />
        )}
      </div>
    </AuthSplitLayout>
  );
}
