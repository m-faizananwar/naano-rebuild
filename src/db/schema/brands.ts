import { index, integer, jsonb, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";
import { users } from "./users";

export type BrandIcp = { title: string; description: string };

export const brands = pgTable(
  "brands",
  {
    ...baseColumns,
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    company: text("company").notNull(),
    website: text("website"),
    valueProp: text("value_prop"),
    icps: jsonb("icps").$type<BrandIcp[]>().notNull().default([]),
    targetIndustries: text("target_industries").array().notNull().default([]),
    targetRegions: text("target_regions").array().notNull().default([]),
    walletCents: integer("wallet_cents").notNull().default(0),
    pixelSiteKey: text("pixel_site_key").notNull(),
  },
  (t) => [
    uniqueIndex("brands_slug_idx").on(t.slug),
    uniqueIndex("brands_pixel_site_key_idx").on(t.pixelSiteKey),
    index("brands_owner_user_id_idx").on(t.ownerUserId),
  ],
);
