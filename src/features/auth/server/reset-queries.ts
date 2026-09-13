import "server-only";
import { isDbConfigured } from "@/db";
import { lookupResetToken, type ResetTokenLookup } from "./reset-tokens";

// For the /reset-password/[token] page: whether to show the form or the
// friendly "link no longer valid" page.
export async function getResetTokenState(raw: string): Promise<ResetTokenLookup["state"] | "unconfigured"> {
  if (!isDbConfigured()) return "unconfigured";
  return (await lookupResetToken(raw)).state;
}
