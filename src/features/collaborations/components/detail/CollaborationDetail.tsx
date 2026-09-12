"use client";

import { useOptimistic } from "react";
import type { CollaborationDetailDto, ViewerRole } from "../../schemas";
import { BrandActions } from "../actions/BrandActions";
import { CollaborationHeader } from "./CollaborationHeader";
import { CreatorActions } from "../actions/CreatorActions";
import { DraftPreview } from "./DraftPreview";
import { EventTimeline } from "./EventTimeline";
import { OfferTerms } from "./OfferTerms";
import { TrackedLinkCard } from "./TrackedLinkCard";
import { useCollaborationAction } from "../actions/useCollaborationAction";

type Props = { detail: CollaborationDetailDto; role: ViewerRole; csrfToken: string };

// The one screen where a status changes. The status badge is optimistic; the
// action panel follows the server's allowedEvents so it can never lie.
export function CollaborationDetail({ detail, role, csrfToken }: Props) {
  const { collaboration: c, events, brief, trackedUrl } = detail;
  const [status, setOptimisticStatus] = useOptimistic(c.status);
  const action = useCollaborationAction(setOptimisticStatus);
  const Actions = role === "creator" ? CreatorActions : BrandActions;

  return (
    <>
      <CollaborationHeader collaboration={c} status={status} role={role} brief={brief} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          {action.isPending ? (
            <section aria-busy="true" className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
              Saving…
            </section>
          ) : (
            <Actions collaboration={c} csrfToken={csrfToken} action={action} />
          )}
          <DraftPreview collaboration={c} role={role} />
          <TrackedLinkCard collaboration={c} trackedUrl={trackedUrl} />
          <EventTimeline events={events} />
        </div>
        <aside className="space-y-4">
          <OfferTerms collaboration={c} />
        </aside>
      </div>
    </>
  );
}
