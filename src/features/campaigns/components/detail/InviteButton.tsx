"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { inviteCreator } from "../../server/actions";

type Props = { campaignId: string; creatorId: string; creatorName: string; disabled?: boolean };

export function InviteButton({ campaignId, creatorId, creatorName, disabled }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function invite() {
    startTransition(async () => {
      const result = await inviteCreator({ campaignId, creatorId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Invitation sent to ${creatorName}`);
      router.refresh();
    });
  }
  return (
    <Button type="button" size="sm" onClick={invite} disabled={disabled || pending} className="bg-brand text-brand-foreground hover:bg-brand/90">
      {disabled ? "Invited" : pending ? "Sending…" : "Invite"}
    </Button>
  );
}
