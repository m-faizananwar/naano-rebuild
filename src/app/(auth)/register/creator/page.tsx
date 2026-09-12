import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { SignUpOptions } from "@/features/auth/components/SignUpOptions";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Join ${BRAND.name} as a creator` };

export default function RegisterCreatorPage() {
  return (
    <AuthSplitLayout>
      <SignUpOptions role="creator" />
    </AuthSplitLayout>
  );
}
