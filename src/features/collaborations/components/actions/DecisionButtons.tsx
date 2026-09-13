"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  acceptLabel: string;
  declineLabel: string;
  declineWarning: string;
  disabled: boolean;
  onDecide: (decision: "accept" | "decline") => void;
};

// Accept is one click; decline is terminal, so it asks first.
export function DecisionButtons({ acceptLabel, declineLabel, declineWarning, disabled, onDecide }: Props) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" disabled={disabled} className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => onDecide("accept")}>
        {acceptLabel}
      </Button>
      <Button type="button" variant="glass" disabled={disabled} onClick={() => setConfirming(true)}>
        {declineLabel}
      </Button>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{declineLabel}?</AlertDialogTitle>
            <AlertDialogDescription>{declineWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it open</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirming(false);
                onDecide("decline");
              }}
            >
              {declineLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
