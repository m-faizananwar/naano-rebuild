import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Settings · naano" };

export default function BrandSettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your company profile and the audience you want to reach." />
      <EmptyState
        title="Profile · Audience · Team & access"
        body="The editors land with brand onboarding. Your workspace details are shown in the account menu meanwhile."
        cta={{ href: "/brand", label: "Back to overview" }}
      />
    </>
  );
}
