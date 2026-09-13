import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import type { BrandOverview } from "../../server/overview-queries";

export function NewCreatorsList({ creators, campaignId }: { creators: BrandOverview["newCreators"]; campaignId: string | null }) {
  const href = campaignId ? `/brand/creators?campaign=${campaignId}` : "/brand/creators";
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-semibold">New creators {creators.length}</h2>
          <p className="text-sm text-muted-foreground">Profiles that fit your buyers</p>
        </div>
        <Link href={href} className="text-sm font-medium text-brand hover:underline">
          See all <span className="arrow-glyph" aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="mt-4 divide-y">
        {creators.map((c) => (
          <li key={c.id} className="flex items-center gap-3 py-3">
            <Avatar className="size-9">
              <AvatarImage src={c.avatarUrl} alt="" />
              <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{c.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{c.industries.join(" · ")}</span>
            </span>
            <span className="hidden text-sm font-semibold text-brand sm:block">{c.fit}% ICP</span>
            <span className="hidden text-sm text-muted-foreground sm:block">from {formatCents(c.priceCents, "EUR")}/post</span>
            <Link href={href} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Add
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
