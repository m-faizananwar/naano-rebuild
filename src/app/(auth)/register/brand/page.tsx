import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { SignUpOptions } from "@/features/auth/components/SignUpOptions";

export const metadata: Metadata = { title: "Join Naano as a brand" };

export default function RegisterBrandPage() {
  return (
    <AuthSplitLayout
      panelTitle="Creators. Brands. Results."
      panelBody="Run LinkedIn creator campaigns that drive real business - discover creators, track performance, pay in one click."
      panelFootnote="Built for B2B marketing teams"
    >
      <SignUpOptions role="brand" />
    </AuthSplitLayout>
  );
}
