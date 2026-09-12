import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Settings · naano" };

export default function CreatorSettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Profile · Payments · Account." />
      <EmptyState
        title="Editors land with onboarding"
        body="Display name, LinkedIn URL, industries and payout method will be editable here."
        cta={{ href: "/creator/card", label: "Open my card" }}
      />
    </>
  );
}
