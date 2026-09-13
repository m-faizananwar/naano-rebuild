"use client";

import { LiveCard } from "@/features/creator-onboarding/components/card/LiveCard";
import type { CardModel } from "@/features/creator-onboarding/components/card/toCardModel";
import { avatarFor } from "@/lib/avatar";
import { useSignupPreview } from "./SignupPreviewContext";

const COPY = {
  eyebrow: "Your marketplace card",
  title: "Build a card brands can trust.",
  body: "It updates live with your profile, analytics, positioning and price.",
};

// The reference's signature moment: the marketplace card next to creator
// sign-up, filling in as the person types. Everything else stays "—" until
// onboarding reads the profile. Entrance: the spec's media-in at --d 0.
export function CreatorCardPanel() {
  const preview = useSignupPreview();
  const v = preview?.values;
  const name = [v?.firstName, v?.lastName].filter(Boolean).join(" ").trim();
  const handle = (v?.email.split("@")[0] ?? "").trim() || "you";
  const model: CardModel = {
    name: name || "Your name",
    handle,
    avatarUrl: name ? avatarFor(handle) : "",
    headline: "",
    industries: [],
    country: null,
    followers: null,
    medianViews: null,
    engagementRate: 0,
    priceCents: null,
    bundle: null,
    bio: "",
    reading: false,
    progress: 0,
  };
  return (
    <aside className="hidden flex-col items-center bg-brand-soft/60 px-12 pt-16 lg:flex">
      <p className="anim text-xs font-semibold uppercase tracking-[0.2em] text-brand" style={{ "--d": 9 } as React.CSSProperties}>{COPY.eyebrow}</p>
      <h2 className="anim mt-3 text-3xl font-bold tracking-tight" style={{ "--d": 10 } as React.CSSProperties}>{COPY.title}</h2>
      <p className="anim mt-2 max-w-md text-center text-muted-foreground" style={{ "--d": 11 } as React.CSSProperties}>{COPY.body}</p>
      <div className="hero__media-in mt-8 w-full max-w-md" style={{ "--d": 0 } as React.CSSProperties}>
        <LiveCard model={model} />
      </div>
    </aside>
  );
}
