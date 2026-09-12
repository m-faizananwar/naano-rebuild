import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Your Naano card, ready to travel. · naano" };

export default function CreatorCardPage() {
  return (
    <>
      <PageHeader title="Your Naano card, ready to travel." description="Share clear proof of your positioning, audience and offers." />
      <EmptyState
        title="Card editor lands with onboarding"
        body="Your card is your deal link: put it on LinkedIn and earn when a brand joins through it."
        cta={{ href: "/creator", label: "Back to overview" }}
      />
    </>
  );
}
