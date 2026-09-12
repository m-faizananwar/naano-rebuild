import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { collaborationEvents, collaborations } from "@/db/schema";
import {
  type Actor,
  type CollaborationEvent,
  IllegalTransitionError,
  nextStatus,
} from "@/lib/collaboration-status";
import { MAX_REVISION_ROUNDS } from "../constants";

type Patch = Partial<
  Pick<typeof collaborations.$inferInsert, "draftText" | "reviewNote" | "postUrl" | "scheduledAt" | "dueDate">
>;

export type TransitionInput = {
  collaborationId: string;
  event: CollaborationEvent;
  actor: Actor;
  note?: string;
  patch?: Patch;
};

// The only code path that changes collaborations.status. Validates the move
// against the pure state machine, writes the new status and the audit event
// in one transaction, and throws IllegalTransitionError on anything else.
export async function transition(input: TransitionInput) {
  const db = getDb();
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(collaborations).where(eq(collaborations.id, input.collaborationId));
    if (!current) throw new Error(`collaboration ${input.collaborationId} not found`);

    const to = nextStatus(current.status, input.event, input.actor);
    if (input.event === "request_changes" && current.revisionRound >= MAX_REVISION_ROUNDS) {
      throw new IllegalTransitionError(current.status, input.event, input.actor);
    }

    const now = new Date();
    const [updated] = await tx
      .update(collaborations)
      .set({
        ...input.patch,
        status: to,
        revisionRound: input.event === "request_changes" ? current.revisionRound + 1 : current.revisionRound,
        publishedAt: to === "live" ? now : current.publishedAt,
        paidAt: to === "paid" ? now : current.paidAt,
      })
      .where(eq(collaborations.id, current.id))
      .returning();

    await tx.insert(collaborationEvents).values({
      collaborationId: current.id,
      fromStatus: current.status,
      toStatus: to,
      event: input.event,
      actor: input.actor,
      note: input.note,
    });

    return updated;
  });
}
