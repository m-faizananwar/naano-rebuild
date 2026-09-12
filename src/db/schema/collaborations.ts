import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";
import { campaigns } from "./campaigns";
import { creators } from "./creators";
import { users } from "./users";

// Mirrors src/lib/collaboration-status.ts — the pure state machine owns the
// list; this enum only makes Postgres enforce it.
export const collaborationStatus = pgEnum("collaboration_status", [
  "invited",
  "applied",
  "accepted",
  "declined",
  "draft_submitted",
  "changes_requested",
  "approved",
  "scheduled",
  "live",
  "paid",
]);
export const collaborationOrigin = pgEnum("collaboration_origin", ["invitation", "application"]);
export const actor = pgEnum("actor", ["brand", "creator", "system"]);

export const collaborations = pgTable(
  "collaborations",
  {
    ...baseColumns,
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    origin: collaborationOrigin("origin").notNull(),
    status: collaborationStatus("status").notNull(),
    feeCents: integer("fee_cents").notNull(),
    // Offer terms from the "Make an offer" dialog. listPriceCents is the creator's
    // rate when the offer was made; feeCents is what was actually offered.
    listPriceCents: integer("list_price_cents"),
    discountPercent: integer("discount_percent").notNull().default(0),
    approveBeforePublish: boolean("approve_before_publish").notNull().default(true),
    acceptBy: timestamp("accept_by", { withTimezone: true }),
    offerNote: text("offer_note"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    revisionRound: integer("revision_round").notNull().default(0),
    draftText: text("draft_text"),
    reviewNote: text("review_note"),
    postUrl: text("post_url"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("collaborations_campaign_creator_idx").on(t.campaignId, t.creatorId),
    index("collaborations_creator_id_idx").on(t.creatorId),
    index("collaborations_status_idx").on(t.status),
  ],
);

// One row per transition(); the audit trail behind "every step tells you where you stand".
export const collaborationEvents = pgTable(
  "collaboration_events",
  {
    ...baseColumns,
    collaborationId: uuid("collaboration_id")
      .notNull()
      .references(() => collaborations.id, { onDelete: "cascade" }),
    fromStatus: collaborationStatus("from_status"),
    toStatus: collaborationStatus("to_status").notNull(),
    event: text("event").notNull(),
    actor: actor("actor").notNull(),
    note: text("note"),
  },
  (t) => [index("collaboration_events_collaboration_id_idx").on(t.collaborationId)],
);

export const messages = pgTable(
  "messages",
  {
    ...baseColumns,
    collaborationId: uuid("collaboration_id")
      .notNull()
      .references(() => collaborations.id, { onDelete: "cascade" }),
    senderUserId: uuid("sender_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
  },
  (t) => [
    index("messages_collaboration_id_idx").on(t.collaborationId),
    index("messages_sender_user_id_idx").on(t.senderUserId),
  ],
);
