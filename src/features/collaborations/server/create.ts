import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { collaborationEvents, collaborations, creators } from "@/db/schema";
import { nextStatus } from "@/lib/collaboration-status";
import { holdBookingFee } from "./side-effects";

const DAY_MS = 86_400_000;
const DEFAULT_POST_BY_DAYS = 14;
const ACCEPT_WINDOW_HOURS = 48;
const HOUR_MS = 3_600_000;
const PERCENT = 100;

export type CreateCollaborationInput = {
  campaignId: string;
  creatorId: string;
  // invitation = brand invites (funded: the fee is held from the wallet now);
  // application = creator applies (fee held when the brand accepts).
  origin: "invitation" | "application";
  // Offer terms (invitations). Defaults: creator's list price, 14 days, approve before publish.
  feeCents?: number;
  discountPercent?: number;
  dueDate?: Date;
  approveBeforePublish?: boolean;
  note?: string;
};

export class DuplicateCollaborationError extends Error {
  constructor() {
    super("This creator already has a collaboration on this campaign");
    this.name = "DuplicateCollaborationError";
  }
}

// Creates the row through the state machine (from: none) and writes the
// first collaboration_events row. Throws InsufficientFundsError for an
// invitation the wallet cannot fund.
export async function createCollaboration(input: CreateCollaborationInput) {
  const db = getDb();
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: collaborations.id })
      .from(collaborations)
      .where(and(eq(collaborations.campaignId, input.campaignId), eq(collaborations.creatorId, input.creatorId)));
    if (existing) throw new DuplicateCollaborationError();

    const [creator] = await tx.select({ priceCents: creators.priceCents }).from(creators).where(eq(creators.id, input.creatorId));
    if (!creator) throw new Error(`creator ${input.creatorId} not found`);

    const actor = input.origin === "invitation" ? "brand" : "creator";
    const event = input.origin === "invitation" ? "invite" : "apply";
    const status = nextStatus(null, event, actor);
    const listPriceCents = creator.priceCents;
    const feeCents =
      input.feeCents ?? Math.round(listPriceCents * (1 - (input.discountPercent ?? 0) / PERCENT));
    const now = Date.now();

    const [collab] = await tx
      .insert(collaborations)
      .values({
        campaignId: input.campaignId,
        creatorId: input.creatorId,
        origin: input.origin,
        status,
        feeCents,
        listPriceCents,
        discountPercent: input.discountPercent ?? 0,
        approveBeforePublish: input.approveBeforePublish ?? true,
        acceptBy: input.origin === "invitation" ? new Date(now + ACCEPT_WINDOW_HOURS * HOUR_MS) : null,
        offerNote: input.note,
        dueDate: input.dueDate ?? new Date(now + DEFAULT_POST_BY_DAYS * DAY_MS),
      })
      .returning();

    await tx.insert(collaborationEvents).values({
      collaborationId: collab.id,
      fromStatus: null,
      toStatus: status,
      event,
      actor,
      note: input.note,
    });

    if (input.origin === "invitation") await holdBookingFee(tx, collab);
    return collab;
  });
}
