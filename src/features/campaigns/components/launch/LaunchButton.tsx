"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import type { LaunchResultDto } from "../../schemas";
import { launchCampaign } from "../../server/actions";

type Props = { campaignId: string; creatorIds: string[] };

export function LaunchButton({ campaignId, creatorIds }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResultDto | null>(null);

  function launch() {
    setError(null);
    startTransition(async () => {
      const outcome = await launchCampaign({ campaignId, creatorIds });
      if (!outcome.ok) {
        setError(outcome.error);
        return;
      }
      const { invited, unfunded, skipped } = outcome.data;
      toast.success(`Campaign launched · ${invited.length} ${invited.length === 1 ? "invitation" : "invitations"} sent`);
      if (unfunded.length === 0 && skipped.length === 0) {
        router.push(`/brand/campaigns/${campaignId}?status=sent`);
        return;
      }
      setResult(outcome.data);
    });
  }

  if (result) {
    return (
      <div className="rounded-2xl border bg-background p-5 text-sm">
        <p className="font-semibold">Campaign launched. {result.invited.length} funded {result.invited.length === 1 ? "invitation" : "invitations"} sent.</p>
        {result.unfunded.length > 0 ? (
          <div className="mt-3">
            <p>Your wallet could not cover these creators:</p>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
              {result.unfunded.map((u) => (
                <li key={u.creatorId}>
                  {u.name} — short by {formatCents(u.shortfallCents, "EUR")}
                </li>
              ))}
            </ul>
            <Link href="/brand/billing" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-2" })}>
              Add budget in Billing →
            </Link>
          </div>
        ) : null}
        {result.skipped.length > 0 ? (
          <ul className="mt-3 list-disc pl-5 text-muted-foreground">
            {result.skipped.map((s) => (
              <li key={s.creatorId}>
                {s.name} — {s.reason}
              </li>
            ))}
          </ul>
        ) : null}
        <Link href={`/brand/campaigns/${campaignId}`} className={buttonVariants({ className: "mt-4 bg-brand text-brand-foreground hover:bg-brand/90" })}>
          Open the campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Button type="button" size="lg" onClick={launch} disabled={pending} className="bg-brand text-brand-foreground hover:bg-brand/90">
        {pending ? "Launching…" : creatorIds.length === 0 ? "Launch without invitations" : `Launch campaign · invite ${creatorIds.length}`}
      </Button>
      {error ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
