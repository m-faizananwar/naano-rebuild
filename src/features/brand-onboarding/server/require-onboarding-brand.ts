import "server-only";
import { redirect } from "next/navigation";
import { ROLE_ONBOARDING } from "@/features/auth/constants";
import { getViewer, type Viewer } from "@/features/auth/server/session";

export type OnboardingBrandViewer = Viewer & { brand: NonNullable<Viewer["brand"]> };

// The onboarding routes sit outside the guarded app shells, so every page
// calls this first: no session → login, a creator → their own onboarding.
export async function requireOnboardingBrand(next: string): Promise<OnboardingBrandViewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!viewer.brand) redirect(ROLE_ONBOARDING.creator);
  return { ...viewer, brand: viewer.brand };
}
