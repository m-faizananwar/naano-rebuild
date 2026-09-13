import "server-only";
import { isDbConfigured } from "@/db";
import { lookupResetToken, type ResetTokenLookup } from "./reset-tokens";

export type ResetPageState = ResetTokenLookup["state"] | "unconfigured" | "unavailable";

// For the /reset-password/[token] page: whether to show the form or the
// friendly "link no longer valid" page. A database that cannot answer (for
// example, the migration not applied yet) is a friendly state too, not a 500.
export async function getResetTokenState(raw: string): Promise<ResetPageState> {
  if (!isDbConfigured()) return "unconfigured";
  try {
    return (await lookupResetToken(raw)).state;
  } catch (error) {
    console.error("[auth] reset token lookup failed", { error });
    return "unavailable";
  }
}
