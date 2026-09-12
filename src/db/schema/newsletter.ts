import { index, pgTable, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";

// "The Letter" sign-ups from the landing footer. Nothing is sent; the row is
// the whole feature (README: real vs stubbed).
export const newsletterSignups = pgTable(
  "newsletter_signups",
  {
    ...baseColumns,
    email: text("email").notNull(),
    source: text("source").notNull().default("landing-footer"),
  },
  (t) => [index("newsletter_signups_email_idx").on(t.email)],
);
