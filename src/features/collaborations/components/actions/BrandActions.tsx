"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { nextStatus } from "@/lib/collaboration-status";
import { formatCents } from "@/lib/money";
import type { CollaborationDto } from "../../schemas";
import { decideApplication, payCollaboration, reviewDraft } from "../../server/actions";
import { ReviewDraftDialog } from "../review/ReviewDraftDialog";
import { ActionPanel } from "./ActionPanel";
import { DecisionButtons } from "./DecisionButtons";
import type { useCollaborationAction } from "./useCollaborationAction";

import { BRAND } from "@/config/brand";
type Props = { collaboration: CollaborationDto; csrfToken: string; action: ReturnType<typeof useCollaborationAction> };

// The brand's allowed moves: accept/decline an application, review a draft,
// pay a live post. Anything else is the creator's turn.
export function BrandActions({ collaboration: c, csrfToken, action }: Props) {
  const { run, isPending } = action;
  const [reviewing, setReviewing] = useState(false);
  const can = (event: string) => c.allowedEvents.includes(event as CollaborationDto["allowedEvents"][number]);
  const base = { collaborationId: c.id, csrfToken };

  if (can("accept") && can("decline")) {
    return (
      <ActionPanel
        title="Accept or decline this application"
        description={`Accepting books ${c.creatorName} for ${formatCents(c.feeCents, "EUR")}: the fee is held from your wallet and the thread opens.`}
      >
        <DecisionButtons
          acceptLabel="Accept and book"
          declineLabel="Decline"
          declineWarning="The creator is told their application was not selected. This cannot be undone."
          disabled={isPending}
          onDecide={(decision) =>
            run(
              nextStatus(c.status, decision, "brand"),
              () => decideApplication({ ...base, decision }),
              decision === "accept" ? `${c.creatorName} is booked. The fee is held in your wallet.` : "Application declined.",
            )
          }
        />
      </ActionPanel>
    );
  }

  if (can("approve") || can("request_changes")) {
    return (
      <ActionPanel title="A draft is waiting for your review" description="Read the complete post before approving or requesting changes.">
        <Button type="button" className="bg-brand text-brand-foreground hover:bg-brand/90" disabled={isPending} onClick={() => setReviewing(true)}>
          Review LinkedIn post
        </Button>
        <ReviewDraftDialog
          collaboration={c}
          open={reviewing}
          onOpenChange={setReviewing}
          disabled={isPending}
          onSubmit={(values) =>
            run(
              nextStatus(c.status, values.decision, "brand"),
              () => reviewDraft({ ...base, ...values }),
              values.decision === "approve" ? "Draft approved — the creator schedules the post next." : "Changes requested.",
            )
          }
        />
      </ActionPanel>
    );
  }

  if (can("pay")) {
    return (
      <ActionPanel title="The post is live" description={`Release the held fee to the creator. ${BRAND.name} handles the invoice and the payout.`}>
        <Button
          type="button"
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          disabled={isPending}
          onClick={() => run("paid", () => payCollaboration(base), `${formatCents(c.feeCents, "EUR")} released to ${c.creatorName}.`)}
        >
          Pay {formatCents(c.feeCents, "EUR")}
        </Button>
      </ActionPanel>
    );
  }

  return null;
}
