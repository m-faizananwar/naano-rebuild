import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { CreatorPickDto } from "../../schemas";
import { CreatorRow } from "./CreatorRow";
import { InviteButton } from "./InviteButton";

type Props = { campaignId: string; creators: CreatorPickDto[]; canInvite: boolean };

export function ShortlistTab({ campaignId, creators, canInvite }: Props) {
  return (
    <div className="rounded-2xl border bg-background p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Shortlist</h2>
          <p className="text-sm text-muted-foreground">Save creators from the marketplace to build your shortlist.</p>
        </div>
        <Link href="/brand/creators" className={buttonVariants({ variant: "outline" })}>
          Find creators →
        </Link>
      </div>
      {creators.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Your shortlist is empty. Bookmark creators in the marketplace and they show up here with their fit for this brief.
        </p>
      ) : (
        <ul className="mt-4 divide-y">
          {creators.map((creator) => (
            <li key={creator.id}>
              <CreatorRow
                creator={creator}
                action={
                  canInvite ? (
                    <InviteButton campaignId={campaignId} creatorId={creator.id} creatorName={creator.name} disabled={creator.alreadyInvited} />
                  ) : (
                    <span className="text-xs text-muted-foreground">Launch first</span>
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
      {!canInvite ? <p className="mt-3 text-xs text-muted-foreground">Invitations open once the campaign is launched.</p> : null}
    </div>
  );
}
