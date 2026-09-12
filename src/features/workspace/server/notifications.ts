import "server-only";
import { and, desc, eq, gte, inArray, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { brands, campaigns, collaborations, creators, messages, users } from "@/db/schema";
import { NOTIFICATION_LIMIT } from "../constants";

export type Notification = { id: string; title: string; body: string; href: string; at: string };

const DAY_MS = 86_400_000;
const RECENT_DAYS = 14;

const BRAND_STATUS_COPY: Record<string, (creator: string, campaign: string) => { title: string; body: string }> = {
  applied: (c, k) => ({ title: `${c} applied`, body: `${k} · accept to create the booking` }),
  draft_submitted: (c, k) => ({ title: `Draft ready from ${c}`, body: `${k} · review before it is published` }),
  live: (c, k) => ({ title: `${c}'s post is live`, body: `${k} · pay to release the creator's earnings` }),
};
const CREATOR_STATUS_COPY: Record<string, (brand: string, campaign: string) => { title: string; body: string }> = {
  invited: (b, k) => ({ title: `${b} sent a collaboration request`, body: `${k} · accept or decline within 48 hours` }),
  changes_requested: (b, k) => ({ title: `${b} requested changes`, body: `${k} · update your draft` }),
  approved: (b, k) => ({ title: `${b} approved your draft`, body: `${k} · schedule the post` }),
  paid: (b, k) => ({ title: `${b} paid you`, body: `${k} · earnings released` }),
};

export async function getBrandNotifications(brandId: string, userId: string): Promise<Notification[]> {
  const db = getDb();
  const since = new Date(Date.now() - RECENT_DAYS * DAY_MS);
  const rows = await db
    .select({ id: collaborations.id, status: collaborations.status, updatedAt: collaborations.updatedAt, campaign: campaigns.name, firstName: users.firstName, lastName: users.lastName })
    .from(collaborations)
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .innerJoin(creators, eq(creators.id, collaborations.creatorId))
    .innerJoin(users, eq(users.id, creators.userId))
    .where(and(eq(campaigns.brandId, brandId), inArray(collaborations.status, ["applied", "draft_submitted", "live"])))
    .orderBy(desc(collaborations.updatedAt))
    .limit(NOTIFICATION_LIMIT);
  const msgs = await db
    .select({ id: messages.id, createdAt: messages.createdAt, collaborationId: messages.collaborationId, firstName: users.firstName, lastName: users.lastName })
    .from(messages)
    .innerJoin(collaborations, eq(collaborations.id, messages.collaborationId))
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .innerJoin(users, eq(users.id, messages.senderUserId))
    .where(and(eq(campaigns.brandId, brandId), ne(messages.senderUserId, userId), gte(messages.createdAt, since)))
    .orderBy(desc(messages.createdAt))
    .limit(NOTIFICATION_LIMIT);
  const items: Notification[] = [
    ...rows.map((r) => {
      const copy = BRAND_STATUS_COPY[r.status]?.(`${r.firstName} ${r.lastName}`, r.campaign) ?? { title: r.status, body: r.campaign };
      return { id: r.id, ...copy, href: `/brand/collaborations/${r.id}`, at: r.updatedAt.toISOString() };
    }),
    ...msgs.map((m) => ({ id: m.id, title: `New message from ${m.firstName} ${m.lastName}`, body: "Open the thread to reply", href: `/brand/messages/${m.collaborationId}`, at: m.createdAt.toISOString() })),
  ];
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, NOTIFICATION_LIMIT);
}

export async function getCreatorNotifications(creatorId: string, userId: string): Promise<Notification[]> {
  const db = getDb();
  const since = new Date(Date.now() - RECENT_DAYS * DAY_MS);
  const rows = await db
    .select({ id: collaborations.id, status: collaborations.status, updatedAt: collaborations.updatedAt, campaign: campaigns.name, brand: brands.company })
    .from(collaborations)
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .innerJoin(brands, eq(brands.id, campaigns.brandId))
    .where(and(eq(collaborations.creatorId, creatorId), inArray(collaborations.status, ["invited", "changes_requested", "approved", "paid"])))
    .orderBy(desc(collaborations.updatedAt))
    .limit(NOTIFICATION_LIMIT);
  const msgs = await db
    .select({ id: messages.id, createdAt: messages.createdAt, collaborationId: messages.collaborationId, brand: brands.company })
    .from(messages)
    .innerJoin(collaborations, eq(collaborations.id, messages.collaborationId))
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .innerJoin(brands, eq(brands.id, campaigns.brandId))
    .where(and(eq(collaborations.creatorId, creatorId), ne(messages.senderUserId, userId), gte(messages.createdAt, since)))
    .orderBy(desc(messages.createdAt))
    .limit(NOTIFICATION_LIMIT);
  const items: Notification[] = [
    ...rows.map((r) => {
      const copy = CREATOR_STATUS_COPY[r.status]?.(r.brand, r.campaign) ?? { title: r.status, body: r.campaign };
      return { id: r.id, ...copy, href: `/creator/collaborations/${r.id}`, at: r.updatedAt.toISOString() };
    }),
    ...msgs.map((m) => ({ id: m.id, title: `New message from ${m.brand}`, body: "Open the thread to reply", href: `/creator/messages/${m.collaborationId}`, at: m.createdAt.toISOString() })),
  ];
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, NOTIFICATION_LIMIT);
}
