import { ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PublishedPost } from "../../server/queries";

export function PublishedPostsTable({ posts }: { posts: PublishedPost[] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="font-semibold">Post performance</h2>
      <p className="text-sm text-muted-foreground">Published posts and the clicks on their tracked link.</p>
      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No published posts yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Tracked link</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Post</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.collaborationId}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={p.avatarUrl} alt="" />
                        <AvatarFallback>{p.creator.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{p.creator}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.campaign}</TableCell>
                  <TableCell className="text-muted-foreground">{p.publishedAt ? p.publishedAt.slice(0, "YYYY-MM-DD".length) : "—"}</TableCell>
                  <TableCell>
                    <a href={p.trackedUrl} className="font-mono text-xs text-brand hover:underline" target="_blank" rel="noreferrer">
                      {p.trackedUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </TableCell>
                  <TableCell className="text-right font-medium">{p.clicks.toLocaleString("en-US")}</TableCell>
                  <TableCell className="text-right">
                    {p.postUrl ? (
                      <a href={p.postUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                        View post <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
