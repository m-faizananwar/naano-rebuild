import { POST_EXAMPLES, type PublicPost } from "../../constants";
import { PillLink } from "../shared/PillLink";
import { SectionHeading } from "../shared/SectionHeading";
import { PostExampleCard } from "./PostExampleCard";

// Hidden entirely when there is no database: no invented posts on the landing page.
export function PostExamplesSection({ posts }: { posts: PublicPost[] }) {
  return (
    <section className="bg-background px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {posts.length > 0 ? (
          <>
            <SectionHeading title={POST_EXAMPLES.title} sub={POST_EXAMPLES.sub} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((post) => (
                <PostExampleCard key={post.id} post={post} />
              ))}
            </div>
          </>
        ) : null}
        <div className="mt-14 flex flex-col items-center">
          <PillLink href={POST_EXAMPLES.cta.href} label={POST_EXAMPLES.cta.label} />
          <p className="mt-4 text-sm text-muted-foreground">{POST_EXAMPLES.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
