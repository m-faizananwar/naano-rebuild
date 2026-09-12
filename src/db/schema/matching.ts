import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";
import { brands } from "./brands";

export const naoFeedbackKind = pgEnum("nao_feedback_kind", ["up", "down", "copy"]);

// One row per thumbs-up / thumbs-down / copy on a Nao answer.
export const naoFeedback = pgTable(
  "nao_feedback",
  {
    ...baseColumns,
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    kind: naoFeedbackKind("kind").notNull(),
    creatorIds: text("creator_ids").array().notNull().default([]),
  },
  (t) => [index("nao_feedback_brand_id_idx").on(t.brandId)],
);
