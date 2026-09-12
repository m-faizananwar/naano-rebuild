import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Join Naano as a creator" };

export default function RegisterCreatorPage() {
  return (
    <AuthSplitLayout
      panelTitle="Your marketplace card"
      panelBody="Build a card brands can trust. Set your own price per post, keep your voice, get paid without the admin."
      panelFootnote="Takes 2 minutes. No commitment."
    >
      <RegisterForm role="creator" />
    </AuthSplitLayout>
  );
}
