import { ExternalLink } from "lucide-react";
import type { PublicPostDto } from "../../server/creator-queries";

export function RecentPostsList({ posts }: { posts: PublicPostDto[] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="font-semibold">Recent LinkedIn posts</h2>
      <p className="text-sm text-muted-foreground">Open the original post on LinkedIn.</p>
      {posts.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">Public post import in progress — the first public LinkedIn posts will appear here automatically.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {posts.map((p) => (
            <li key={p.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{p.postedAt.slice(0, "YYYY-MM-DD".length)} · Public LinkedIn post</span>
                <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
                  Open original <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm">{p.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {p.impressions.toLocaleString("en-US")} estimated · {p.reactions} reactions · {p.comments} comments · {p.reposts} reposts
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
