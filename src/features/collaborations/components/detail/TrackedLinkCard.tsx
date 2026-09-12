import { ExternalLink, MousePointerClick } from "lucide-react";
import type { CollaborationDto } from "../../schemas";

type Props = { collaboration: CollaborationDto; trackedUrl: string | null };

// The creator's unique link and what it has produced so far.
export function TrackedLinkCard({ collaboration: c, trackedUrl }: Props) {
  if (!trackedUrl) return null;
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tracked link</h2>
      <p className="mt-2 text-sm text-muted-foreground">Use this link in the post. Every click lands in the campaign results.</p>
      <code className="mt-2 block truncate rounded-lg bg-muted px-3 py-2 text-sm">{trackedUrl}</code>
      {c.trackingDestination ? <p className="mt-1 truncate text-xs text-muted-foreground">Redirects to {c.trackingDestination}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        {c.clicks !== null ? (
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MousePointerClick className="size-4 text-brand" aria-hidden="true" />
            {c.clicks} click{c.clicks === 1 ? "" : "s"} so far
          </span>
        ) : (
          <span className="text-muted-foreground">Clicks appear once the post is live.</span>
        )}
        {c.postUrl ? (
          <a href={c.postUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
            Open the LinkedIn post
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </section>
  );
}
