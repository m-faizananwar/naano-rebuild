import { format } from "date-fns";
import { ExternalLink, MessageCircle, Repeat2, ThumbsUp } from "lucide-react";
import { formatCompact } from "@/lib/format-euro";
import type { CreatorPostDto } from "../../schemas";

export function LatestPostCard({ post }: { post: CreatorPostDto }) {
  return (
    <article className="rounded-xl border bg-muted/30 p-3 text-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {format(new Date(post.postedAt), "d MMM yyyy")} · Public LinkedIn post
        </span>
        <a href={post.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
          Open original
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </header>
      <p className="mt-2 line-clamp-4 whitespace-pre-line">{post.body}</p>
      <footer className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{formatCompact(post.impressions)} estimated</span>
        <span className="inline-flex items-center gap-1"><ThumbsUp className="size-3" aria-hidden="true" />{post.reactions} reactions</span>
        <span className="inline-flex items-center gap-1"><MessageCircle className="size-3" aria-hidden="true" />{post.comments} comments</span>
        <span className="inline-flex items-center gap-1"><Repeat2 className="size-3" aria-hidden="true" />{post.reposts} reposts</span>
      </footer>
    </article>
  );
}
