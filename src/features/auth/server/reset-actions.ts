"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb, isDbConfigured } from "@/db";
import { sessions, users } from "@/db/schema";
import { ROLE_HOME } from "../constants";
import { type ActionResult, type ForgotPasswordInput, type ResetPasswordInput, forgotPasswordSchema, resetPasswordSchema } from "../schemas";
import { hashPassword } from "./password";
import { sendResetEmail } from "./reset-email";
import { consumeResetToken, issueResetToken, lookupResetToken } from "./reset-tokens";
import { createSession } from "./session";

const NOT_CONFIGURED = "The database is not configured on this deployment, so password reset is unavailable.";

// Same zod/ActionResult pattern as register and login. Like them it runs
// without a session (so no csrf token exists yet); the token itself is the
// proof of possession.

// The link is emailed when RESEND_API_KEY is set (and the send succeeds) and
// always comes back to the page as well, so the flow works without email.
// `resetUrl` is null when no account matches — a demo build says so rather
// than pretending to send.
export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<ActionResult<{ resetUrl: string | null; emailed: boolean }>> {
  if (!isDbConfigured()) return { ok: false, error: NOT_CONFIGURED };
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  try {
    const [user] = await getDb().select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email));
    if (!user) return { ok: true, data: { resetUrl: null, emailed: false } };
    const raw = await issueResetToken(user.id);
    const h = await headers();
    const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
    const resetUrl = `${origin}/reset-password/${raw}`;
    const emailed = await sendResetEmail(parsed.data.email, resetUrl);
    return { ok: true, data: { resetUrl, emailed } };
  } catch (error) {
    console.error("[auth] password reset request failed", { error });
    return { ok: false, error: "We couldn't create a reset link. Try again in a moment." };
  }
}

// Validates the token, sets the password, invalidates the token and every
// other session, signs the user in and sends them to their shell.
export async function resetPassword(input: ResetPasswordInput): Promise<ActionResult<{ redirectTo: string }>> {
  if (!isDbConfigured()) return { ok: false, error: NOT_CONFIGURED };
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const token = await lookupResetToken(parsed.data.token);
  if (token.state !== "valid" || !token.userId || !token.id) return { ok: false, error: "This reset link is no longer valid. Request a new one." };
  try {
    if (!(await consumeResetToken(token.id))) return { ok: false, error: "This reset link was already used. Request a new one." };
    const db = getDb();
    const [user] = await db
      .update(users)
      .set({ passwordHash: await hashPassword(parsed.data.password) })
      .where(eq(users.id, token.userId))
      .returning({ role: users.role });
    if (!user) return { ok: false, error: "This account no longer exists." };
    await db.delete(sessions).where(eq(sessions.userId, token.userId));
    await createSession(token.userId);
    return { ok: true, data: { redirectTo: ROLE_HOME[user.role] } };
  } catch (error) {
    console.error("[auth] password reset failed", { error });
    return { ok: false, error: "We couldn't reset the password. Try again." };
  }
}
