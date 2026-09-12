import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { TeamAccessPanel } from "@/features/workspace/components/settings/TeamAccessPanel";
import { getViewer } from "@/features/auth/server/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Invite creators · naano" };

export default async function BrandInvitePage() {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login");
  return (
    <>
      <PageHeader title="Invite creators" description="Book creators from the marketplace, or let AI Matching build a shortlist from your brief." />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-background p-5">
          <h2 className="font-semibold">From the marketplace</h2>
          <p className="text-sm text-muted-foreground">Every card has Book and Negotiate. Invitations are funded from your wallet and the creator has 48 hours to answer.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/brand/creators" className={buttonVariants()}>Open AI Matching</Link>
            <Link href="/brand/creators?tab=marketplace" className={buttonVariants({ variant: "outline" })}>Browse all creators</Link>
          </div>
        </section>
        <section className="rounded-2xl border bg-background p-5">
          <h2 className="font-semibold">Invite a colleague instead?</h2>
          <p className="text-sm text-muted-foreground">Team access lives in Settings.</p>
          <div className="mt-4">
            <TeamAccessPanel owner={{ name: `${viewer.firstName} ${viewer.lastName}`, email: viewer.email }} />
          </div>
        </section>
      </div>
    </>
  );
}
