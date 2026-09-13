import { index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../columns";

export const userRole = pgEnum("user_role", ["brand", "creator"]);

export const users = pgTable(
  "users",
  {
    ...baseColumns,
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    heardAbout: text("heard_about"),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    ...baseColumns,
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    csrfToken: text("csrf_token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("sessions_token_hash_idx").on(t.tokenHash), index("sessions_user_id_idx").on(t.userId)],
);

// Single-use password reset tokens: only the hash is stored, 30 min expiry,
// used_at set on consumption (src/features/auth/server/reset-tokens.ts).
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    ...baseColumns,
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("password_reset_tokens_hash_idx").on(t.tokenHash), index("password_reset_tokens_user_id_idx").on(t.userId)],
);
