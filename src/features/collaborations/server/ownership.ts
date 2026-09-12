import "server-only";
import { and, eq } from "drizzle-orm";
import type { ZodType } from "zod";
import { getDb } from "@/db";
import { campaigns, collaborations } from "@/db/schema";
import { getViewer, type Viewer } from "@/features/auth/server/session";
import { IllegalTransitionError } from "@/lib/collaboration-status";
import type { ActionResult, ViewerRole } from "../schemas";
import { DuplicateCollaborationError } from "./create";
import { InsufficientFundsError } from "./side-effects";

// Shared preamble for every server action: parse, authenticate, check the
// role and the CSRF token. Returns the parsed input and the viewer, or the
// friendly error to send back.
export async function authorize<T extends { csrfToken: string }>(
  schema: ZodType<T>,
  input: unknown,
  role: ViewerRole | "any",
): Promise<{ ok: true; data: T; viewer: Viewer } | { ok: false; error: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const viewer = await getViewer();
  if (!viewer || (role !== "any" && viewer.role !== role)) return { ok: false, error: "Your session has expired. Sign in again." };
  if (parsed.data.csrfToken !== viewer.csrfToken) return { ok: false, error: "This form is stale. Reload the page and try again." };
  return { ok: true, data: parsed.data, viewer };
}

// The collaboration must belong to the viewer: their creator row, or a
// campaign of their brand. Returns the id when it does, null otherwise.
export async function ownedCollaborationId(viewer: Viewer, collaborationId: string) {
  const owner =
    viewer.role === "creator"
      ? viewer.creator && eq(collaborations.creatorId, viewer.creator.id)
      : viewer.brand && eq(campaigns.brandId, viewer.brand.id);
  if (!owner) return null;
  const [row] = await getDb()
    .select({ id: collaborations.id })
    .from(collaborations)
    .innerJoin(campaigns, eq(campaigns.id, collaborations.campaignId))
    .where(and(eq(collaborations.id, collaborationId), owner));
  return row?.id ?? null;
}

export const NOT_YOURS = "This collaboration is not in your workspace.";

// Domain errors become a sentence the user can act on; everything else is
// logged with context and hidden behind a generic message.
export function friendlyError(error: unknown, context: Record<string, unknown>): ActionResult<never> {
  if (error instanceof IllegalTransitionError) {
    return {
      ok: false,
      code: "illegal_transition",
      error: "This step is no longer available — the collaboration has moved on. Reload to see its current state.",
    };
  }
  if (error instanceof InsufficientFundsError) {
    return {
      ok: false,
      code: "insufficient_funds",
      error: "Your wallet does not cover this booking. Top up on the Billing page and try again.",
    };
  }
  if (error instanceof DuplicateCollaborationError) {
    return { ok: false, code: "duplicate", error: "You already have a collaboration on this campaign." };
  }
  console.error("[collaborations] action failed", { ...context, error });
  return { ok: false, error: "Something went wrong on our side. Nothing was changed — please try again." };
}
