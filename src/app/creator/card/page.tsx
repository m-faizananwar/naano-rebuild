import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/features/auth/server/session";
import { CardBack } from "@/features/workspace/components/CardBack";
import { DealLinkDialog } from "@/features/workspace/components/card/DealLinkDialog";
import { CreatorCardPreview } from "@/features/workspace/components/overview/CreatorCardPreview";
import { AFFILIATE_MONTHS, AFFILIATE_SHARE_PERCENT } from "@/features/workspace/constants";
import { getPublicCard } from "@/features/workspace/server/card-queries";

export const metadata: Metadata = { title: "My card · naano" };

export default async function CreatorCardPage() {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login");
  const card = await getPublicCard(viewer.creator.handle);
  if (!card) redirect("/login");
  const h = await headers();
  const link = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}/c/${card.handle}`;
  return (
    <>
      <PageHeader
        eyebrow="Your creator storefront"
        title="Your Naano card, ready to travel."
        description="Share clear proof of your positioning, audience and offers."
        actions={<Link href="/creator/settings" className={buttonVariants({ variant: "outline" })}>Edit</Link>}
      />
      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <div className="grid gap-4">
          <CreatorCardPreview card={card} />
          <div className="flex flex-wrap gap-2">
            <DealLinkDialog url={link} handle={card.handle} />
            <Link href={`/c/${card.handle}`} target="_blank" className={buttonVariants({ variant: "outline" })}>Open card</Link>
          </div>
        </div>
        <div className="grid gap-4">
          <section className="rounded-2xl border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your card is your deal link</p>
            <h2 className="mt-1 text-xl font-semibold">Put it on LinkedIn. Earn when a brand joins through it.</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <li>· Add it as a LinkedIn experience — brands discover your positioning without a DM.</li>
              <li>· Send it when a brand contacts you — price, audience and proof in one link.</li>
            </ul>
            <p className="mt-3 text-sm"><span className="font-semibold">Your share {AFFILIATE_SHARE_PERCENT}%</span> · reward period {AFFILIATE_MONTHS} months</p>
            <p className="mt-2 break-all rounded-lg bg-muted px-3 py-2 font-mono text-xs">{link}</p>
          </section>
          <CardBack card={card} />
        </div>
      </div>
    </>
  );
}
