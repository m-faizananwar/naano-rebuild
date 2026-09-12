"use client";

import { nextStatus } from "@/lib/collaboration-status";
import type { CollaborationDto } from "../../schemas";
import { decideInvitation, publishPost, schedulePost, submitDraft } from "../../server/actions";
import { ActionPanel } from "./ActionPanel";
import { DecisionButtons } from "./DecisionButtons";
import { DraftForm } from "./DraftForm";
import { PublishForm } from "./PublishForm";
import { ScheduleForm } from "./ScheduleForm";
import type { useCollaborationAction } from "./useCollaborationAction";

type Props = { collaboration: CollaborationDto; csrfToken: string; action: ReturnType<typeof useCollaborationAction> };

// Exactly the moves the state machine allows the creator, keyed on
// allowedEvents so a stale page can never show a button the server refuses.
export function CreatorActions({ collaboration: c, csrfToken, action }: Props) {
  const { run, isPending } = action;
  const can = (event: string) => c.allowedEvents.includes(event as CollaborationDto["allowedEvents"][number]);
  const base = { collaborationId: c.id, csrfToken };

  if (can("accept") && can("decline")) {
    return (
      <ActionPanel
        title="Accept or decline this invitation"
        description="Accepting creates the booking on these terms; the brand's fee is already held for you."
      >
        <DecisionButtons
          acceptLabel="Accept the invitation"
          declineLabel="Decline"
          declineWarning="The brand gets its fee back and this collaboration closes for good."
          disabled={isPending}
          onDecide={(decision) =>
            run(
              nextStatus(c.status, decision, "creator"),
              () => decideInvitation({ ...base, decision }),
              decision === "accept" ? "Booking confirmed — your thread with the brand is open." : "Invitation declined.",
            )
          }
        />
      </ActionPanel>
    );
  }

  if (can("submit_draft")) {
    const resubmit = c.status === "changes_requested";
    return (
      <ActionPanel
        title={resubmit ? `Update your draft (round ${c.revisionRound} of ${c.maxRevisionRounds})` : "Submit your draft"}
        description={resubmit ? "The brand asked for changes. Edit the post below and send it back." : "Write the post as it will go out. The brand reviews it before you publish."}
      >
        {resubmit && c.reviewNote ? (
          <blockquote className="mb-4 rounded-lg border-l-2 border-amber-400 bg-background px-3 py-2 text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">The brand&apos;s note</span>
            {c.reviewNote}
          </blockquote>
        ) : null}
        <DraftForm
          initialText={c.draftText ?? ""}
          submitLabel={resubmit ? "Resubmit draft" : "Send for review"}
          disabled={isPending}
          onSubmit={(values) =>
            run("draft_submitted", () => submitDraft({ ...base, ...values }), "Draft sent — the brand reviews it next.")
          }
        />
      </ActionPanel>
    );
  }

  if (can("schedule")) {
    return (
      <ActionPanel title="Schedule the post" description="Approved. Pick the day you will publish; then come back to add the post URL.">
        <ScheduleForm
          dueDate={c.dueDate}
          disabled={isPending}
          onSubmit={(values) => run("scheduled", () => schedulePost({ ...base, ...values }), "Post scheduled.")}
        />
      </ActionPanel>
    );
  }

  if (can("publish")) {
    return (
      <ActionPanel title="Publish and add the post URL" description="Once the post is on LinkedIn, paste its URL. Clicks on your tracked link start counting.">
        <PublishForm disabled={isPending} onSubmit={(values) => run("live", () => publishPost({ ...base, ...values }), "You're live. Payment follows once the brand releases it.")} />
      </ActionPanel>
    );
  }

  return null;
}
