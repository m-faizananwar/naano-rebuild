import { ExternalLink } from "lucide-react";
import { formatDay } from "@/lib/dates";
import type { AnalyticsDto } from "../../schemas";

export function PostPerformance({ posts }: { posts: AnalyticsDto["posts"] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Post performance</h2>
        <span className="text-xs text-muted-foreground">Without a pixel · clicks from tracked links</span>
      </div>
      {posts.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No published posts yet. Metrics land here the moment a creator submits a live post URL.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {posts.map((post) => (
            <li key={post.collaborationId} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{post.creatorName}</p>
                <a href={post.postUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-xs text-brand hover:underline">
                  <span className="truncate">{post.postUrl}</span>
                  <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                </a>
                <p className="text-xs text-muted-foreground">Published {formatDay(post.publishedAt)}</p>
              </div>
              <p className="shrink-0 text-right">
                <span className="text-lg font-semibold tabular-nums">{post.clicks.toLocaleString("en-GB")}</span>
                <span className="block text-xs text-muted-foreground">clicks</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
