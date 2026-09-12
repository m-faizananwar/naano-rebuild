import type { OnboardingBundle, OnboardingState } from "../../server/queries";

// What the live marketplace card renders. Nulls are "not known yet" and show as "—".
export type CardModel = {
  name: string;
  handle: string;
  avatarUrl: string;
  headline: string;
  industries: string[];
  country: string | null;
  followers: number | null;
  medianViews: number | null;
  engagementRate: number;
  priceCents: number | null;
  bundle: OnboardingBundle | null;
  bio: string;
  reading: boolean;
  // 0–100: how much of the card is filled in. "Pending" until it reaches 100.
  progress: number;
};

export type CardOverrides = Partial<Omit<CardModel, "progress">>;

const PROGRESS_FIELDS = 5;
const PERCENT = 100;

function progressOf(model: Omit<CardModel, "progress">): number {
  const known = [
    model.followers !== null,
    model.headline.length > 0,
    model.country !== null,
    model.industries.length > 0,
    model.priceCents !== null,
  ].filter(Boolean).length;
  return Math.round((known / PROGRESS_FIELDS) * PERCENT);
}

// State from the db plus whatever the current step's form holds right now.
export function toCardModel(state: OnboardingState, overrides: CardOverrides = {}): CardModel {
  const base: Omit<CardModel, "progress"> = {
    name: state.name || "Your name",
    handle: state.handle,
    avatarUrl: state.avatarUrl,
    headline: state.headline,
    industries: state.industries,
    country: state.cardCompleted ? state.country : null,
    followers: state.profileRead ? state.followers : null,
    medianViews: state.profileRead ? state.medianViews : null,
    engagementRate: state.engagementRate,
    priceCents: state.cardCompleted && state.priceCents > 0 ? state.priceCents : null,
    bundle: state.bundles[0] ?? null,
    bio: state.bio,
    reading: false,
    ...overrides,
  };
  return { ...base, progress: progressOf(base) };
}
