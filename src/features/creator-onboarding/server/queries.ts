import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { creators, users } from "@/db/schema";

export type OnboardingBundle = { posts: number; totalCents: number };

// Everything the four steps and the live card need, re-read on every page.
export type OnboardingState = {
  creatorId: string;
  handle: string;
  name: string;
  firstName: string;
  avatarUrl: string;
  linkedinUrl: string;
  headline: string;
  bio: string;
  country: string;
  industries: string[];
  followers: number;
  medianViews: number;
  engagementRate: number;
  priceCents: number;
  bundles: OnboardingBundle[];
  // Step 2 done: the public profile has been read at least once.
  profileRead: boolean;
  // Step 3 done: the creator confirmed country + industries, so the flag may show.
  cardCompleted: boolean;
  onboarded: boolean;
  professional: {
    legalCountry: string | null;
    registeredBusiness: boolean | null;
    legalName: string;
    legalAddress: string;
    taxAcknowledged: boolean;
    invoicingAuthorized: boolean;
  };
};

export async function getOnboardingState(creatorId: string): Promise<OnboardingState | null> {
  const [row] = await getDb()
    .select({ creator: creators, firstName: users.firstName, lastName: users.lastName })
    .from(creators)
    .innerJoin(users, eq(users.id, creators.userId))
    .where(eq(creators.id, creatorId));
  if (!row) return null;
  const c = row.creator;
  return {
    creatorId: c.id,
    handle: c.handle,
    name: `${row.firstName} ${row.lastName}`.trim(),
    firstName: row.firstName,
    avatarUrl: c.avatarUrl,
    linkedinUrl: c.linkedinUrl,
    headline: c.headline,
    bio: c.bio,
    country: c.country,
    industries: c.industries,
    followers: c.followers,
    medianViews: c.medianViews,
    engagementRate: c.engagementRate,
    priceCents: c.priceCents,
    bundles: c.bundles.map((b) => ({ posts: b.posts, totalCents: b.totalCents })),
    profileRead: c.linkedinUrl.length > 0 && c.followers > 0,
    cardCompleted: c.industries.length > 0,
    onboarded: Boolean(c.onboardingCompletedAt),
    professional: {
      legalCountry: c.legalCountry,
      registeredBusiness: c.registeredBusiness,
      legalName: c.legalName ?? "",
      legalAddress: c.legalAddress ?? "",
      taxAcknowledged: c.taxAcknowledged,
      invoicingAuthorized: c.invoicingAuthorized,
    },
  };
}
