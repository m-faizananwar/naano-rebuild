import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BRAND } from "@/config/brand";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RoleChoiceCards } from "@/features/auth/components/RoleChoiceCards";
import { REGISTER_ROLE_PARAM } from "@/features/auth/constants";

export const metadata: Metadata = { title: `Create your account · ${BRAND.wordmark}` };

// /register?role=saas|influencer (naano's own query values, used by the landing
// CTAs) skips the chooser and lands on that role's sign-up step.
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const target = role ? REGISTER_ROLE_PARAM[role] : undefined;
  if (target) redirect(target);
  return (
    <AuthSplitLayout>
      <RoleChoiceCards />
    </AuthSplitLayout>
  );
}
