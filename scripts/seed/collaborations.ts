import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import {
  clicks, collaborationEvents, collaborations, ledgerEntries, messages, pixelEvents, trackingLinks,
} from "@/db/schema";
import { type CollaborationStatus, pathTo } from "@/lib/collaboration-status";
import { faker, hex, jitter } from "./random";
import { tierFor } from "./taxonomy";

export type CollabSpec = {
  campaignId: string;
  brandId: string;
  brandUserId: string;
  brandCompany: string;
  destination: string;
  pixelSiteKey: string;
  creatorId: string;
  creatorUserId: string;
  creatorFollowers: number;
  creatorMedianViews: number;
  feeCents: number;
  origin: "invitation" | "application";
  status: CollaborationStatus;
  // Days ago the collaboration started; for live/paid the publish day is derived from it.
  startedDaysAgo: number;
  dueInDays: number;
};

const DAY_MS = 86_400_000;
const STEP_DAYS = 2;
const MAX_CLICKS_PER_LINK = 160;
const DRAFT_TEXT =
  "Founder-led outbound dies at the research step, not the writing step.\n\nI used to spend Sunday nights building lists. " +
  "This week the list, the context and the first draft were waiting on Monday. I only did the conversations.\n\n" +
  "Sponsored partnership — I'd say this anyway.";
const MESSAGE_LINES = [
  ["brand", "Thanks for accepting! The brief is attached to the campaign. Deadline is in the collaboration card."],
  ["creator", "Great — I'll take the 'practical introduction' angle and share a draft this week."],
  ["brand", "Perfect. One ask: keep the disclosure in the first three lines."],
  ["creator", "Done in the draft. Let me know if the hook lands."],
] as const;

function at(startedDaysAgo: number, step: number) {
  return new Date(Date.now() - (startedDaysAgo - step * STEP_DAYS) * DAY_MS);
}

function hourWeightedOffset() {
  // Exponential decay from publish day (mean 2.5 days), daytime hours.
  const dayOffset = -Math.log(1 - faker.number.float({ min: 0, max: 0.98 })) * 2.5;
  const hour = faker.number.int({ min: 7, max: 22 });
  return dayOffset * DAY_MS + hour * 3_600_000 + faker.number.int({ min: 0, max: 3_599_000 });
}

export async function seedCollaboration(db: Db, spec: CollabSpec) {
  const path = pathTo(spec.status, spec.origin);
  const lastStep = path.length - 1;
  const publishedStep = path.findIndex((t) => t.to === "live");
  const publishedAt = publishedStep >= 0 ? at(spec.startedDaysAgo, publishedStep) : null;
  const paidStep = path.findIndex((t) => t.to === "paid");
  const hasDraft = path.some((t) => t.to === "draft_submitted");
  const changes = path.filter((t) => t.to === "changes_requested").length;

  const [collab] = await db
    .insert(collaborations)
    .values({
      campaignId: spec.campaignId,
      creatorId: spec.creatorId,
      origin: spec.origin,
      status: spec.status,
      feeCents: spec.feeCents,
      dueDate: new Date(Date.now() + spec.dueInDays * DAY_MS),
      revisionRound: changes,
      draftText: hasDraft ? DRAFT_TEXT : null,
      reviewNote: spec.status === "changes_requested" ? "Love the hook. Can you move the disclosure up and shorten the middle?" : null,
      postUrl: publishedAt ? `https://www.linkedin.com/posts/activity-${faker.string.numeric(19)}` : null,
      scheduledAt: path.some((t) => t.to === "scheduled") ? at(spec.startedDaysAgo, publishedStep >= 0 ? publishedStep : lastStep) : null,
      publishedAt,
      paidAt: paidStep >= 0 ? at(spec.startedDaysAgo, paidStep) : null,
      createdAt: at(spec.startedDaysAgo, 0),
      updatedAt: at(spec.startedDaysAgo, lastStep),
    })
    .returning();

  await db.insert(collaborationEvents).values(
    path.map((t, i) => ({
      collaborationId: collab.id,
      fromStatus: t.from,
      toStatus: t.to,
      event: t.event,
      actor: t.actor,
      createdAt: at(spec.startedDaysAgo, i),
      updatedAt: at(spec.startedDaysAgo, i),
    })),
  );

  const accepted = path.some((t) => t.to === "accepted");
  if (accepted) await seedAcceptedSideEffects(db, spec, collab.id, path.findIndex((t) => t.to === "accepted"));
  if (publishedAt) await seedClicks(db, spec, collab.id, publishedAt);
  if (paidStep >= 0) await seedPayout(db, spec, collab.id, { at: at(spec.startedDaysAgo, paidStep), status: "completed" });
  // Live but not yet paid: the creator sees it as "awaiting release".
  else if (publishedAt) await seedPayout(db, spec, collab.id, { at: publishedAt, status: "pending" });
  return collab;
}

async function seedAcceptedSideEffects(db: Db, spec: CollabSpec, collaborationId: string, acceptedStep: number) {
  const acceptedAt = at(spec.startedDaysAgo, acceptedStep);
  await db.insert(trackingLinks).values({
    collaborationId,
    code: hex(8),
    destination: spec.destination,
    createdAt: acceptedAt,
    updatedAt: acceptedAt,
  });
  await db.insert(ledgerEntries).values({
    brandId: spec.brandId,
    collaborationId,
    type: "booking",
    status: spec.status === "paid" ? "completed" : "pending",
    amountCents: -spec.feeCents,
    reference: `BK-${hex(6).toUpperCase()}`,
    description: `Booking · ${spec.brandCompany}`,
    createdAt: acceptedAt,
    updatedAt: acceptedAt,
  });
  const count = faker.number.int({ min: 2, max: MESSAGE_LINES.length });
  await db.insert(messages).values(
    MESSAGE_LINES.slice(0, count).map(([who, body], i) => ({
      collaborationId,
      senderUserId: who === "brand" ? spec.brandUserId : spec.creatorUserId,
      body,
      createdAt: new Date(acceptedAt.getTime() + i * 3 * 3_600_000),
      updatedAt: new Date(acceptedAt.getTime() + i * 3 * 3_600_000),
    })),
  );
}

async function seedClicks(db: Db, spec: CollabSpec, collaborationId: string, publishedAt: Date) {
  const [link] = await db.select().from(trackingLinks).where(eq(trackingLinks.collaborationId, collaborationId));
  if (!link) return;
  const tier = tierFor(spec.creatorFollowers);
  const target = Math.min(MAX_CLICKS_PER_LINK, Math.round(spec.creatorMedianViews * tier.ctr * jitter(1, 0.3)));
  const now = Date.now();
  const rows = Array.from({ length: target }, () => ({
    trackingLinkId: link.id,
    clickedAt: new Date(Math.min(now - 60_000, publishedAt.getTime() + hourWeightedOffset())),
    ipHash: hex(16),
    userAgent: faker.internet.userAgent(),
    referrer: "https://www.linkedin.com/",
    country: faker.helpers.arrayElement(["FR", "UK", "US", "DE", "NL", "ES"]),
  }));
  if (rows.length === 0) return;
  const inserted = await db.insert(clicks).values(rows).returning({ id: clicks.id, clickedAt: clicks.clickedAt });

  // Pixel: visits for roughly half the clicks, a handful of signups, at most one purchase.
  const visits = inserted.filter(() => faker.datatype.boolean({ probability: 0.55 }));
  const signups = faker.helpers.arrayElements(inserted, Math.max(1, Math.round(inserted.length * 0.012)));
  const purchase = faker.datatype.boolean({ probability: 0.5 }) ? [faker.helpers.arrayElement(signups)] : [];
  const event = (c: { id: string; clickedAt: Date }, type: "visit" | "signup" | "purchase", valueCents = 0) => ({
    brandId: spec.brandId,
    clickId: c.id,
    type,
    valueCents,
    visitorId: hex(12),
    occurredAt: new Date(c.clickedAt.getTime() + faker.number.int({ min: 5_000, max: 1_800_000 })),
  });
  await db.insert(pixelEvents).values([
    ...visits.map((c) => event(c, "visit")),
    ...signups.map((c) => event(c, "signup")),
    ...purchase.map((c) => event(c, "purchase", 4_900)),
  ]);
}

async function seedPayout(
  db: Db,
  spec: CollabSpec,
  collaborationId: string,
  opts: { at: Date; status: "pending" | "completed" },
) {
  await db.insert(ledgerEntries).values({
    creatorId: spec.creatorId,
    collaborationId,
    type: "payout",
    status: opts.status,
    amountCents: spec.feeCents,
    reference: `PO-${hex(6).toUpperCase()}`,
    description: `Payout · ${spec.brandCompany}`,
    createdAt: opts.at,
    updatedAt: opts.at,
  });
}
