import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPT_WINDOW_HOURS } from "../../constants";

type Props = { creatorName: string; onClose: () => void };

export function BookingSent({ creatorName, onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle2 className="size-10 text-emerald-600" aria-hidden="true" />
      <p className="text-lg font-semibold">Invitation sent</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {creatorName} has {ACCEPT_WINDOW_HOURS} hours to accept. The fee is held on your balance and released back if they decline.
      </p>
      <Button type="button" onClick={onClose} className="mt-2">
        Done
      </Button>
    </div>
  );
}
