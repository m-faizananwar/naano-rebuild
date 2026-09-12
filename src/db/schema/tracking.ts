import { index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";
import { brands } from "./brands";
import { collaborations } from "./collaborations";

export const pixelEventType = pgEnum("pixel_event_type", ["visit", "signup", "purchase"]);

export const trackingLinks = pgTable(
  "tracking_links",
  {
    ...baseColumns,
    collaborationId: uuid("collaboration_id")
      .notNull()
      .references(() => collaborations.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    destination: text("destination").notNull(),
  },
  (t) => [
    uniqueIndex("tracking_links_code_idx").on(t.code),
    uniqueIndex("tracking_links_collaboration_id_idx").on(t.collaborationId),
  ],
);

// One row per redirect. The redirect handler is one insert + one 302, nothing else.
export const clicks = pgTable(
  "clicks",
  {
    ...baseColumns,
    trackingLinkId: uuid("tracking_link_id")
      .notNull()
      .references(() => trackingLinks.id, { onDelete: "cascade" }),
    clickedAt: timestamp("clicked_at", { withTimezone: true }).notNull().defaultNow(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    country: text("country"),
  },
  (t) => [index("clicks_tracking_link_id_clicked_at_idx").on(t.trackingLinkId, t.clickedAt)],
);

export const pixelEvents = pgTable(
  "pixel_events",
  {
    ...baseColumns,
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    clickId: uuid("click_id").references(() => clicks.id, { onDelete: "set null" }),
    type: pixelEventType("type").notNull(),
    valueCents: integer("value_cents").notNull().default(0),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    visitorId: text("visitor_id"),
  },
  (t) => [
    index("pixel_events_brand_id_occurred_at_idx").on(t.brandId, t.occurredAt),
    index("pixel_events_click_id_idx").on(t.clickId),
  ],
);
