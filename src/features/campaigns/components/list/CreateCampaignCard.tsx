import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateCampaignCard() {
  return (
    <Link
      href="/brand/campaigns/new"
      className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed bg-background p-5 text-center transition-colors hover:border-brand hover:bg-brand/5 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
        <Plus className="size-5" aria-hidden="true" />
      </span>
      <span className="mt-3 text-lg font-semibold">Create a campaign</span>
      <span className="mt-1 max-w-xs text-sm text-muted-foreground">
        Launch a new campaign in 2 minutes — with AI, the Naano team, or an existing link.
      </span>
    </Link>
  );
}
