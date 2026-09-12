import "server-only";
import { redirect } from "next/navigation";
import { ROLE_ONBOARDING } from "@/features/auth/constants";
import { getViewer } from "@/features/auth/server/session";
import { getOnboardingState, type OnboardingState } from "./queries";

// /onboarding/creator sits outside the guarded shells, so every page resolves
// the viewer itself: no session → login, brand → its own onboarding.
export async function requireOnboardingCreator(pathname: string): Promise<OnboardingState> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(pathname)}`);
  if (viewer.role === "brand" || !viewer.creator) redirect(ROLE_ONBOARDING.brand);
  const state = await getOnboardingState(viewer.creator.id);
  if (!state) redirect("/login");
  return state;
}
