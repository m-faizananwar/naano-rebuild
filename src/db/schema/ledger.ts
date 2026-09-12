import { index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";
import { brands } from "./brands";
import { collaborations } from "./collaborations";
import { creators } from "./creators";

export const ledgerType = pgEnum("ledger_type", ["topup", "booking", "payout", "withdrawal"]);
export const ledgerStatus = pgEnum("ledger_status", ["pending", "completed"]);

// Wallet balance, creator earnings and invoices are all views over this table.
// Amounts are signed from the party's point of view (topup +, booking −, payout +, withdrawal −).
export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    ...baseColumns,
    brandId: uuid("brand_id").references(() => brands.id, { onDelete: "cascade" }),
    creatorId: uuid("creator_id").references(() => creators.id, { onDelete: "cascade" }),
    collaborationId: uuid("collaboration_id").references(() => collaborations.id, { onDelete: "set null" }),
    type: ledgerType("type").notNull(),
    status: ledgerStatus("status").notNull().default("completed"),
    amountCents: integer("amount_cents").notNull(),
    reference: text("reference").notNull(),
    description: text("description").notNull().default(""),
  },
  (t) => [
    index("ledger_entries_brand_id_idx").on(t.brandId),
    index("ledger_entries_creator_id_idx").on(t.creatorId),
    index("ledger_entries_collaboration_id_idx").on(t.collaborationId),
  ],
);
