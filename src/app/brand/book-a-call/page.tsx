import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Book a call · naano" };

export default function BrandBookACallPage() {
  return (
    <>
      <PageHeader title="Book a call" description="15 minutes with a Naano expert to plan your next campaign. No commitment · Slot available today." />
      <EmptyState
        title="Calendar booking is not part of this build"
        body="The real product embeds Google Calendar here. Everything else in the workspace is live."
        cta={{ href: "/brand", label: "Back to overview" }}
      />
    </>
  );
}
