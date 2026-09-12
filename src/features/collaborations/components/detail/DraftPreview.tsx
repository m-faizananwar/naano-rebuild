import type { CollaborationDto, ViewerRole } from "../../schemas";

type Props = { collaboration: CollaborationDto; role: ViewerRole };

// The draft as last submitted, once the creator is no longer editing it.
export function DraftPreview({ collaboration: c, role }: Props) {
  const editing = role === "creator" && c.allowedEvents.includes("submit_draft");
  if (!c.draftText || editing) return null;
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {c.status === "draft_submitted" ? "Draft awaiting review" : "Approved draft"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{c.draftText}</p>
      {c.reviewNote && c.status === "changes_requested" ? (
        <blockquote className="mt-3 rounded-lg border-l-2 border-amber-400 bg-muted/50 px-3 py-2 text-sm">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your note</span>
          {c.reviewNote}
        </blockquote>
      ) : null}
    </section>
  );
}
