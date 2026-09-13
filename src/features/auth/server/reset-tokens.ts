import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { passwordResetTokens } from "@/db/schema";
import { type ResetTokenState, resetTokenExpiry, resetTokenState } from "@/lib/reset-token";

const TOKEN_BYTES = 32;
const hashToken = (raw: string) => createHash("sha256").update(raw).digest("hex");

// Issues a single-use token: the raw value goes into the link, only its hash
// is stored. Earlier unused tokens for the user are invalidated (deleted).
export async function issueResetToken(userId: string): Promise<string> {
  const raw = randomBytes(TOKEN_BYTES).toString("base64url");
  const db = getDb();
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  await db.insert(passwordResetTokens).values({ userId, tokenHash: hashToken(raw), expiresAt: resetTokenExpiry(Date.now()) });
  return raw;
}

export type ResetTokenLookup = { state: ResetTokenState | "missing"; userId?: string; id?: string };

export async function lookupResetToken(raw: string): Promise<ResetTokenLookup> {
  const [row] = await getDb().select().from(passwordResetTokens).where(eq(passwordResetTokens.tokenHash, hashToken(raw)));
  if (!row) return { state: "missing" };
  return { state: resetTokenState(row, Date.now()), userId: row.userId, id: row.id };
}

// Marks the token used. Returns false if another request got there first.
export async function consumeResetToken(id: string): Promise<boolean> {
  const rows = await getDb()
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResetTokens.id, id), isNull(passwordResetTokens.usedAt)))
    .returning({ id: passwordResetTokens.id });
  return rows.length > 0;
}
