import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatDay } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { CampaignDto, CreatorPickDto, EstimateDto } from "../../schemas";
import { CreatorRow } from "../detail/CreatorRow";
import { EstimatorCard } from "../EstimatorCard";
import { LaunchButton } from "./LaunchButton";

type Props = { campaign: CampaignDto; creators: CreatorPickDto[]; estimate: EstimateDto; walletCents: number };

export function ReviewStep({ campaign, creators, estimate, walletCents }: Props) {
  const base = `/brand/campaigns/${campaign.id}/launch`;
  const short = estimate.totalSpendCents > walletCents;
  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border bg-background p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{campaign.name}</h2>
            <p className="text-sm text-muted-foreground">{campaign.description}</p>
          </div>
          <Link href={`${base}?step=basics`} className="text-sm font-medium text-brand hover:underline">
            Edit
          </Link>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Post deadline</dt>
            <dd className="font-medium">{formatDay(campaign.postDeadline)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Default fee</dt>
            <dd className="font-medium">{formatCents(campaign.defaultFeeCents, "EUR")} / post</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Brief</dt>
            <dd className="font-medium">
              {campaign.brief.angles.length} {campaign.brief.angles.length === 1 ? "angle" : "angles"} ·{" "}
              <Link href={`${base}?step=brief`} className="text-brand hover:underline">
                Edit the brief
              </Link>
            </dd>
          </div>
        </dl>
      </section>
      <section className="rounded-2xl border bg-background p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {creators.length} {creators.length === 1 ? "creator" : "creators"} to invite
          </h2>
          <Link href={`${base}?step=creators`} className="text-sm font-medium text-brand hover:underline">
            Change
          </Link>
        </div>
        {creators.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No creators selected. You can invite from the marketplace after launch.</p>
        ) : (
          <ul className="mt-2 divide-y">
            {creators.map((creator) => (
              <li key={creator.id}>
                <CreatorRow creator={creator} />
              </li>
            ))}
          </ul>
        )}
        <p className={`mt-3 text-sm ${short ? "text-destructive" : "text-muted-foreground"}`}>
          {formatCents(estimate.totalSpendCents, "EUR")} held from your wallet ({formatCents(walletCents, "EUR")} available)
          {short ? " — invitations beyond your balance are reported, not sent." : "."}
        </p>
      </section>
      <EstimatorCard estimate={estimate} />
      <div className="flex flex-wrap items-center gap-2">
        <LaunchButton campaignId={campaign.id} creatorIds={creators.map((c) => c.id)} />
        <Link href={`${base}?step=creators`} className={buttonVariants({ variant: "ghost" })}>
          Back
        </Link>
      </div>
    </div>
  );
}
