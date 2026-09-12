import "server-only";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { campaigns, collaborations, creators, users } from "@/db/schema";
import type { CollaborationStatus } from "@/lib/collaboration-status";

// Spoken names are fuzzy ("Sarah", "sarah chen", "@sarahchen"), so every lookup
// is a case-insensitive contains on the fields a user would actually say.
const pattern = (name: string) => `%${name.trim().replace(/^@/, "")}%`;

export type NamedCreator = { id: string; name: string; handle: string };
export type NamedCampaign = { id: string; name: string };
export type NamedCollaboration = { id: string; creatorName: string; campaignName: string; status: CollaborationStatus };

export async function findCreatorByName(name: string): Promise<NamedCreator | null> {
  const p = pattern(name);
  const rows = await getDb()
    .select({ id: creators.id, handle: creators.handle, firstName: users.firstName, lastName: users.lastName })
    .from(creators)
    .innerJoin(users, eq(users.id, creators.userId))
    .where(or(ilike(creators.handle, p), ilike(sql`${users.firstName} || ' ' || ${users.lastName}`, p)))
    .limit(1);
  const row = rows[0];
  return row ? { id: row.id, handle: row.handle, name: `${row.firstName} ${row.lastName}` } : null;
}

export async function findCampaignByName(brandId: string, name: string): Promise<NamedCampaign | null> {
  const rows = await getDb()
    .select({ id: campaigns.id, name: campaigns.name })
    .from(campaigns)
    .where(and(eq(campaigns.brandId, brandId), ilike(campaigns.name, pattern(name))))
    .limit(1);
  return rows[0] ?? null;
}

// Open campaigns a creator can apply to, by spoken name (any brand).
export async function findOpenCampaignByName(name: string): Promise<NamedCampaign | null> {
  const rows = await getDb()
    .select({ id: campaigns.id, name: campaigns.name })
    .from(campaigns)
    .where(and(eq(campaigns.status, "active"), ilike(campaigns.name, pattern(name))))
    .limit(1);
  return rows[0] ?? null;
}

// The brand's collaboration with a creator in one of the given statuses, so
// "approve Sarah's draft" resolves to the draft that is actually waiting.
export async function findBrandCollaboration(input: {
  brandId: string;
  creatorName: string;
  statuses: readonly CollaborationStatus[];
}): Promise<NamedCollaboration | null> {
  const p = pattern(input.creatorName);
  const rows = await getDb()
    .select({
      id: collaborations.id,
      status: collaborations.status,
      campaignName: campaigns.name,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(collaborations)
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .innerJoin(creators, eq(creators.id, collaborations.creatorId))
    .innerJoin(users, eq(users.id, creators.userId))
    .where(
      and(
        eq(campaigns.brandId, input.brandId),
        inArray(collaborations.status, [...input.statuses]),
        or(ilike(creators.handle, p), ilike(sql`${users.firstName} || ' ' || ${users.lastName}`, p)),
      ),
    )
    .limit(1);
  const row = rows[0];
  return row ? { id: row.id, status: row.status, campaignName: row.campaignName, creatorName: `${row.firstName} ${row.lastName}` } : null;
}

// The creator's own collaboration that is waiting for a draft.
export async function findCreatorCollaboration(creatorId: string, statuses: readonly CollaborationStatus[]) {
  const rows = await getDb()
    .select({ id: collaborations.id, status: collaborations.status, campaignName: campaigns.name })
    .from(collaborations)
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .where(and(eq(collaborations.creatorId, creatorId), inArray(collaborations.status, [...statuses])))
    .orderBy(collaborations.updatedAt)
    .limit(1);
  return rows[0] ?? null;
}

// "Book X" without naming a campaign goes on the brand's newest active one.
export async function findLatestActiveCampaign(brandId: string): Promise<NamedCampaign | null> {
  const rows = await getDb()
    .select({ id: campaigns.id, name: campaigns.name })
    .from(campaigns)
    .where(and(eq(campaigns.brandId, brandId), eq(campaigns.status, "active")))
    .orderBy(desc(campaigns.createdAt))
    .limit(1);
  return rows[0] ?? null;
}
