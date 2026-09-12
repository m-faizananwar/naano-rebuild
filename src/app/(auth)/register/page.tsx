import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RoleChoiceCards } from "@/features/auth/components/RoleChoiceCards";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Create your account · ${BRAND.wordmark}` };

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      panelTitle="One platform. Two sides."
      panelBody="Creators get paid to post. B2B brands get real pipeline. Pick where you fit and we'll set the rest up in a couple of minutes."
    >
      <RoleChoiceCards />
    </AuthSplitLayout>
  );
}
