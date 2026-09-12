import type { CreatorDto } from "../../schemas";
import { LatestPostCard } from "./LatestPostCard";
import { ReachChart } from "./ReachChart";

export function ContentPerformance({ creator, all = false }: { creator: CreatorDto; all?: boolean }) {
  const posts = all ? creator.posts : creator.posts.slice(0, 1);
  return (
    <section className="rounded-2xl border bg-background p-4">
      <h3 className="font-semibold">Content performance</h3>
      <p className="text-xs text-muted-foreground">Reach across recent posts</p>
      <div className="mt-3">
        <ReachChart posts={creator.posts} />
      </div>
      <div className="mt-4 grid gap-3">
        {posts.map((post) => (
          <LatestPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
