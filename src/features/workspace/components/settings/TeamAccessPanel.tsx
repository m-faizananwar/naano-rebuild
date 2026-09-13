"use client";

import { CreatorAvatar } from "@/features/public/components/shared/CreatorAvatar";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BRAND } from "@/config/brand";
// Copy verbatim from the inventory. Invitations need email delivery, which
// this build does not have, so the form validates and says so honestly.
export function TeamAccessPanel({ owner }: { owner: { name: string; email: string } }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);
  return (
    <div className="grid gap-6">
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setNote(`No email provider in this build, so ${email} did not receive a link. Existing ${BRAND.name} users would get access immediately.`);
        }}
      >
        <div>
          <h3 className="font-semibold">Invite a colleague</h3>
          <p className="text-sm text-muted-foreground">They&apos;ll receive a secure link that expires after 14 days.</p>
        </div>
        <Label htmlFor="invite-email">Work email</Label>
        <div className="flex gap-2">
          <Input id="invite-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com" />
          <Button type="submit">Send invitation</Button>
        </div>
        <p className="text-xs text-muted-foreground">New users create their account from the private email link. Existing {BRAND.name} users get access immediately.</p>
        {note ? <p className="rounded-lg bg-muted px-3 py-2 text-sm" role="status">{note}</p> : null}
      </form>
      <div>
        <h3 className="font-semibold">People with access — 1 people</h3>
        <p className="text-sm text-muted-foreground">Active members and invitations awaiting acceptance</p>
        <ul className="mt-3 rounded-xl border">
          <li className="flex items-center gap-3 p-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              <CreatorAvatar name={owner.name} className="size-full" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{owner.name} <span className="text-xs text-muted-foreground">· You</span></span>
              <span className="block truncate text-xs text-muted-foreground">{owner.email}</span>
            </span>
            <span className="rounded-full border px-2 py-0.5 text-xs font-semibold">Owner</span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">Members receive administrator access. Only you, the owner, can invite or remove people.</p>
      </div>
    </div>
  );
}
