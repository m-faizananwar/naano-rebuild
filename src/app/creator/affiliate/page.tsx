import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Recommend Naano. Earn for 3 months. · naano" };

export default function CreatorAffiliatePage() {
  return (
    <>
      <PageHeader title="Recommend Naano. Earn for 3 months." description="Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive 25% of Naano's commission for three months." />
      <EmptyState
        title="No brands introduced yet"
        body="Your referral link identifies you automatically. The three-month reward period starts after the company's first completed paid campaign."
        cta={{ href: "/creator/card", label: "Open my card" }}
      />
    </>
  );
}
