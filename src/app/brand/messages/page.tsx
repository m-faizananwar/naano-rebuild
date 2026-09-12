import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Messages · naano" };

export default function BrandMessagesPage() {
  return (
    <>
      <PageHeader title="Messages" description="All messages, filtered by campaign." />
      <EmptyState
        title="Threads open with your bookings"
        body="Invite a creator — the thread opens as soon as the first booking is accepted."
        cta={{ href: "/brand/creators", label: "Invite a creator" }}
      />
    </>
  );
}
