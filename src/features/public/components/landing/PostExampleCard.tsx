import { ExternalLink, Eye, MousePointerClick, Users } from "lucide-react";
import { POST_EXAMPLES, type PublicPost } from "../../constants";
import { CreatorAvatar } from "../shared/CreatorAvatar";

const format = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function PostExampleCard({ post }: { post: PublicPost }) {
  const stats = [
    { icon: Eye, value: format.format(post.impressions), label: "Impressions" },
    { icon: MousePointerClick, value: format.format(post.clicksEst), label: `Clicks (${POST_EXAMPLES.estLabel})` },
    { icon: Users, value: format.format(post.leadsEst), label: `Leads (${POST_EXAMPLES.estLabel})` },
  ];
  return (
    <article className="glass-card frost-card flex flex-col overflow-hidden rounded-[48px] bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b bg-muted/30 p-4">
        <CreatorAvatar name={post.creatorName} src={post.avatarUrl} className="size-10" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{post.creatorName}</p>
          <p className="truncate text-xs text-muted-foreground">{post.creatorLine}</p>
        </div>
      </div>
      <p className="line-clamp-3 flex-1 p-4 text-base font-semibold leading-snug">{post.title}</p>
      <div aria-hidden="true" className="mx-4 h-28 rounded-lg bg-linear-to-br from-brand-sky/70 via-brand-soft to-muted" />
      <dl className="m-4 grid grid-cols-3 gap-1 rounded-xl bg-muted/50 p-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <dd className="flex items-center justify-center gap-1 text-sm font-bold">
              <stat.icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {stat.value}
            </dd>
            <dt className="text-[0.65rem] text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between border-t px-4 py-3 text-xs">
        <span className="text-muted-foreground">LinkedIn</span>
        <a href={post.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
          View post
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
