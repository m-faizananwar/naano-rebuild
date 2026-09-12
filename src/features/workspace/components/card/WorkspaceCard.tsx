"use client";

import { LiveCard } from "@/features/creator-onboarding/components/card/LiveCard";
import type { CardModel } from "@/features/creator-onboarding/components/card/toCardModel";
import type { PublicCard } from "../../server/card-queries";

const COMPLETE = 100;

// The marketplace card as brands see it, in the workspace: the same vertical
// card as onboarding (front + flip to the back), with naano's workspace labels.
export function WorkspaceCard({ card }: { card: PublicCard }) {
  const model: CardModel = {
    name: card.name,
    handle: card.handle,
    avatarUrl: card.avatarUrl,
    headline: card.headline,
    industries: card.industries,
    country: card.country,
    followers: card.followers,
    medianViews: card.medianViews,
    engagementRate: card.engagementRate,
    priceCents: card.priceCents,
    bundle: card.bundle,
    bio: card.bio,
    reading: false,
    progress: COMPLETE,
    costLabel: "Chosen cost",
    hasPostData: card.postsAnalyzed > 0,
  };
  return <LiveCard model={model} />;
}
