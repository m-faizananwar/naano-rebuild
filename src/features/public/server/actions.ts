"use server";

import { getDb, isDbConfigured } from "@/db";
import { newsletterSignups } from "@/db/schema";
import { newsletterSchema, type PublicActionResult } from "../schemas";

// "The Letter" on the landing footer: one row per submit, nothing sent.
// Public, no session — the form is on the marketing page.
export async function subscribeNewsletter(input: unknown): Promise<PublicActionResult<{ email: string }>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  if (!isDbConfigured()) return { ok: false, error: "Sign-ups are off in this environment (no database)." };
  try {
    await getDb().insert(newsletterSignups).values({ email: parsed.data.email });
    return { ok: true, data: { email: parsed.data.email } };
  } catch (error) {
    console.error("[public] newsletter signup failed", { error });
    return { ok: false, error: "We couldn't save that. Try again in a moment." };
  }
}
