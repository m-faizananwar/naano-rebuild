import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Messages · naano" };

export default function CreatorMessagesPage() {
  return (
    <>
      <PageHeader title="Messages" description="All messages with the brands you work with." />
      <EmptyState
        title="Threads open with your bookings"
        body="The thread opens as soon as a booking is accepted."
        cta={{ href: "/creator/opportunities", label: "Browse opportunities" }}
      />
    </>
  );
}
