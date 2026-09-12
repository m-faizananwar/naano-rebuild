import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Invite creators · naano" };

export default function BrandInvitePage() {
  return (
    <>
      <PageHeader title="Invite creators" description="Bring creators you already work with onto Naano and book them from your workspace." />
      <EmptyState
        title="Invite by link or email"
        body="Invitations are wired with the marketplace in the next build step."
        cta={{ href: "/brand/creators", label: "Browse creators" }}
      />
    </>
  );
}
