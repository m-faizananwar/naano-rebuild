"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteCampaign } from "../../server/actions";

export function DeleteCampaignButton({ campaignId, name }: { campaignId: string; name: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function confirm() {
    setPending(true);
    const result = await deleteCampaign(campaignId);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Campaign deleted");
    router.push("/brand/campaigns");
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="icon" aria-label="Delete campaign" />}>
        <Trash2 aria-hidden="true" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            Invitations and applications on this campaign are removed and any held fees go back to your wallet. Campaigns with
            published or paid posts can&apos;t be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm} disabled={pending}>{pending ? "Deleting…" : "Delete campaign"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
