"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "../../server/actions";

export function DeleteAccountButton({ isDemo }: { isDemo: boolean }) {
  const [pending, setPending] = useState(false);
  async function confirm() {
    setPending(true);
    const result = await deleteAccount();
    setPending(false);
    if (result && !result.ok) toast.error(result.error);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            {isDemo
              ? "This is the shared demo account, so deletion is blocked. On a real account this removes the user, the profile, sessions and collaborations."
              : "This removes your user, profile, sessions and collaborations. It cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm} disabled={pending || isDemo}>
            {pending ? "Deleting…" : "Delete account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
