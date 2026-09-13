import { SHOWCASE } from "../../constants";
import { GlassCard } from "../glass/GlassCard";
import { CreatorAvatar } from "../shared/CreatorAvatar";

type Kind = (typeof SHOWCASE.stats)[number]["kind"];
const AVATAR_NAMES = ["Léa M", "Karim B", "Jonas W", "Amir S", "Yara K"];

function Illustration({ kind }: { kind: Kind }) {
  if (kind === "avatars") {
    return (
      <div className="flex -space-x-3">
        {AVATAR_NAMES.map((name) => (
          <CreatorAvatar key={name} name={name} className="size-12 ring-2 ring-background" />
        ))}
      </div>
    );
  }
  if (kind === "flags") {
    return (
      <ul className="flex max-w-56 flex-wrap gap-3 text-2xl" aria-label="Countries">
        {SHOWCASE.flags.map((flag) => (
          <li key={flag} className="rounded-lg bg-background px-1.5 shadow-sm ring-1 ring-border/60">
            {flag}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <CreatorAvatar name="Aya D" className="size-12" />
        <p className="mt-1 text-[0.6rem] text-muted-foreground">{SHOWCASE.matchExample.label}</p>
      </div>
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand ring-4 ring-background">{SHOWCASE.matchExample.fit}</span>
      <ul className="space-y-1.5">
        {SHOWCASE.matchExample.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-background px-3 py-0.5 text-[0.65rem] font-semibold shadow-sm ring-1 ring-border/60">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ShowcaseStatCard({ title, body, kind, index }: { title: string; body: string; kind: Kind; index: number }) {
  return (
    <GlassCard title={title} index={index + 1} order={index} className="p-6">
      <div className="flex h-28 items-center">
        <Illustration kind={kind} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{body}</p>
    </GlassCard>
  );
}
