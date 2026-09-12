import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { SignUpOptions } from "@/features/auth/components/SignUpOptions";

export const metadata: Metadata = { title: "Join Naano as a creator" };

export default function RegisterCreatorPage() {
  return (
    <AuthSplitLayout
      panelVariant="card"
      panelEyebrow="Your marketplace card"
      panelTitle="Build a card brands can trust."
      panelBody="It updates live with your profile, analytics, positioning and price."
    >
      <SignUpOptions role="creator" />
    </AuthSplitLayout>
  );
}
