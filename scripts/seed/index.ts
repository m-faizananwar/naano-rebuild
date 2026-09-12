import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { createDb, type Db } from "@/db";
import {
  brands, campaigns, creatorPosts, creators, ledgerEntries, shortlist, users,
} from "@/db/schema";
import type { CollaborationStatus } from "@/lib/collaboration-status";
import { BRANDS, type BrandFixture } from "./brands";
import { seedCollaboration, type CollabSpec } from "./collaborations";
import { buildCreators, type CreatorFixture } from "./creators";
import { daysAgo, faker, hex } from "./random";

loadEnvConfig(process.cwd());

export const DEMO_PASSWORD = "demo1234";
const BCRYPT_COST = 10;

type SeededCreator = CreatorFixture & { id: string; userId: string };
type SeededCampaign = { id: string; key: string; brand: BrandFixture & { id: string; userId: string } };

async function reset(db: Db) {
  await db.execute(sql`
    TRUNCATE TABLE pixel_events, clicks, tracking_links, messages, collaboration_events, collaborations,
      ledger_entries, shortlist, campaigns, creator_posts, creators, brands, sessions, users
    RESTART IDENTITY CASCADE
  `);
}

async function seedCreators(db: Db, passwordHash: string): Promise<SeededCreator[]> {
  const fixtures = buildCreators();
  const insertedUsers = await db
    .insert(users)
    .values(fixtures.map((c) => ({ email: c.email, passwordHash, role: "creator" as const, firstName: c.firstName, lastName: c.lastName })))
    .returning({ id: users.id, email: users.email });
  const userIdByEmail = new Map(insertedUsers.map((u) => [u.email, u.id]));

  const insertedCreators = await db
    .insert(creators)
    .values(
      fixtures.map((c) => ({
        userId: userIdByEmail.get(c.email) as string,
        handle: c.handle,
        linkedinUrl: `https://www.linkedin.com/in/${c.handle}`,
        headline: c.headline,
        bio: c.bio,
        country: c.country,
        industries: c.industries,
        followers: c.followers,
        priceCents: c.priceCents,
        bundles: c.bundles,
        medianViews: c.medianViews,
        engagementRate: c.engagementRate,
        postsPerMonth: c.postsPerMonth,
        audienceJobTitles: c.audienceJobTitles,
        audienceSeniority: c.audienceSeniority,
        avatarUrl: c.avatarUrl,
        onboardingCompletedAt: daysAgo(faker.number.int({ min: 20, max: 200 })),
      })),
    )
    .returning({ id: creators.id, handle: creators.handle });
  const idByHandle = new Map(insertedCreators.map((c) => [c.handle, c.id]));

  await db.insert(creatorPosts).values(
    fixtures.flatMap((c) => c.posts.map((p) => ({ ...p, creatorId: idByHandle.get(c.handle) as string }))),
  );
  return fixtures.map((c) => ({ ...c, id: idByHandle.get(c.handle) as string, userId: userIdByEmail.get(c.email) as string }));
}

async function seedBrands(db: Db, passwordHash: string): Promise<SeededCampaign[]> {
  const result: SeededCampaign[] = [];
  for (const fixture of BRANDS) {
    const [user] = await db
      .insert(users)
      .values({ email: fixture.owner.email, passwordHash, role: "brand", firstName: fixture.owner.firstName, lastName: fixture.owner.lastName })
      .returning({ id: users.id });
    const [brand] = await db
      .insert(brands)
      .values({
        ownerUserId: user.id,
        slug: fixture.slug,
        company: fixture.company,
        website: fixture.website,
        valueProp: fixture.valueProp,
        icps: fixture.icps,
        targetIndustries: fixture.targetIndustries,
        targetRegions: fixture.targetRegions,
        walletCents: 0,
        pixelSiteKey: fixture.pixelSiteKey,
        onboardingCompletedAt: daysAgo(36),
      })
      .returning({ id: brands.id });
    await db.insert(ledgerEntries).values({
      brandId: brand.id,
      type: "topup",
      amountCents: fixture.topupCents,
      reference: `TU-${hex(6).toUpperCase()}`,
      description: "Wallet top-up",
      createdAt: daysAgo(35),
      updatedAt: daysAgo(35),
    });
    const inserted = await db
      .insert(campaigns)
      .values(fixture.campaigns.map((c) => ({ ...c, brandId: brand.id, key: undefined })))
      .returning({ id: campaigns.id, name: campaigns.name });
    fixture.campaigns.forEach((c, i) => result.push({ id: inserted[i].id, key: c.key, brand: { ...fixture, id: brand.id, userId: user.id } }));
  }
  return result;
}

// One creator per status on the demo campaign, plus extra live/paid so the
// click table has a few hundred rows. Fit-matched creators, mid-sized reach.
function pickForZune(pool: SeededCreator[], n: number) {
  const target = new Set(["B2B", "SaaS", "AI", "Sales", "Growth / GTM"]);
  return pool
    .filter((c) => c.industries.some((i) => target.has(i)) && c.followers >= 1500 && c.followers <= 40000)
    .slice(0, n);
}

function spec(
  campaign: SeededCampaign,
  creator: SeededCreator,
  s: { status: CollaborationStatus; origin: "invitation" | "application"; startedDaysAgo: number },
): CollabSpec {
  return {
    campaignId: campaign.id,
    brandId: campaign.brand.id,
    brandUserId: campaign.brand.userId,
    brandCompany: campaign.brand.company,
    // The demo brand's links land on our pixel demo page so the whole loop is clickable on the live site.
    destination: campaign.brand.key === "zune" ? "/demo/landing" : campaign.brand.website,
    pixelSiteKey: campaign.brand.pixelSiteKey,
    creatorId: creator.id,
    creatorUserId: creator.userId,
    creatorFollowers: creator.followers,
    creatorMedianViews: creator.medianViews,
    feeCents: creator.priceCents,
    dueInDays: faker.number.int({ min: 3, max: 14 }),
    ...s,
  };
}

async function seedCollaborations(db: Db, campaignList: SeededCampaign[], allCreators: SeededCreator[]) {
  const byKey = Object.fromEntries(campaignList.map((c) => [c.key, c]));
  const [demo, ...others] = allCreators;
  const zunePool = pickForZune(others, 11);
  const zuneStates: Array<[CollaborationStatus, "invitation" | "application", number]> = [
    ["applied", "application", 2],
    ["accepted", "invitation", 5],
    ["declined", "invitation", 12],
    ["draft_submitted", "application", 7],
    ["changes_requested", "invitation", 8],
    ["approved", "invitation", 9],
    ["scheduled", "application", 10],
    ["live", "invitation", 20],
    ["live", "application", 14],
    ["paid", "invitation", 28],
    ["paid", "application", 26],
  ];
  const specs: CollabSpec[] = [
    spec(byKey["zune-main"], demo, { status: "invited", origin: "invitation", startedDaysAgo: 1 }),
    ...zuneStates.map(([status, origin, startedDaysAgo], i) =>
      spec(byKey["zune-main"], zunePool[i], { status, origin, startedDaysAgo }),
    ),
    spec(byKey["pi-main"], demo, { status: "changes_requested", origin: "application", startedDaysAgo: 9 }),
    spec(byKey["pi-main"], others[40], { status: "live", origin: "invitation", startedDaysAgo: 15 }),
    spec(byKey["pi-main"], others[41], { status: "accepted", origin: "application", startedDaysAgo: 4 }),
    spec(byKey["pi-spring"], demo, { status: "paid", origin: "invitation", startedDaysAgo: 70 }),
    spec(byKey["pi-spring"], others[42], { status: "paid", origin: "invitation", startedDaysAgo: 68 }),
    spec(byKey["pi-spring"], others[43], { status: "paid", origin: "application", startedDaysAgo: 66 }),
    spec(byKey["orbi-main"], demo, { status: "live", origin: "application", startedDaysAgo: 12 }),
    spec(byKey["orbi-main"], others[44], { status: "applied", origin: "application", startedDaysAgo: 2 }),
    spec(byKey["orbi-main"], others[45], { status: "approved", origin: "invitation", startedDaysAgo: 6 }),
  ];
  for (const s of specs) await seedCollaboration(db, s);

  await db.insert(shortlist).values(zunePool.slice(0, 4).map((c) => ({ brandId: byKey["zune-main"].brand.id, creatorId: c.id })));
  // The demo creator withdrew part of the paid collaboration.
  await db.insert(ledgerEntries).values({
    creatorId: demo.id,
    type: "withdrawal",
    amountCents: -20_000,
    reference: `WD-${hex(6).toUpperCase()}`,
    description: "Withdrawal · Stripe",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  });
  return specs.length;
}

// wallet_cents is a cache of the brand's ledger; keep it consistent.
async function syncWallets(db: Db) {
  await db.execute(sql`
    UPDATE brands b SET wallet_cents = COALESCE(
      (SELECT SUM(amount_cents) FROM ledger_entries l WHERE l.brand_id = b.id), 0)
  `);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const { db, close } = createDb(url);
  try {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_COST);
    await reset(db);
    const seededCreators = await seedCreators(db, passwordHash);
    const seededCampaigns = await seedBrands(db, passwordHash);
    const collabCount = await seedCollaborations(db, seededCampaigns, seededCreators);
    await syncWallets(db);
    const [counts] = await db.execute<{ clicks: number; signups: number }>(sql`
      SELECT (SELECT COUNT(*) FROM clicks)::int AS clicks,
             (SELECT COUNT(*) FROM pixel_events WHERE type = 'signup')::int AS signups
    `);
    console.log(
      `seed: ${seededCreators.length} creators, ${BRANDS.length} brands, ${seededCampaigns.length} campaigns, ` +
        `${collabCount} collaborations, ${counts.clicks} clicks, ${counts.signups} signups. ` +
        `Demo logins: brand@demo.naano / creator@demo.naano (password ${DEMO_PASSWORD}).`,
    );
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
