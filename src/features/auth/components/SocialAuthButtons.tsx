"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

type Props = { mode: "signup" | "signin"; onEmail?: () => void };

const BUTTON =
  "flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border bg-card text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";
const NOTE = "Not available in this build — use email.";

function GoogleMark() {
  return (
    <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
      G
    </span>
  );
}

// naano offers LinkedIn / Google / email. There is no OAuth in this build, so
// the first two explain themselves inline instead of failing silently.
export function SocialAuthButtons({ mode, onEmail }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const verb = mode === "signup" ? "Sign up" : "Continue";
  return (
    <div className="grid gap-3">
      <button type="button" className={BUTTON} onClick={() => setNote("LinkedIn")}>
        <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-[4px] bg-linkedin text-[0.7rem] font-bold text-brand-foreground">
          in
        </span>
        {verb} with LinkedIn
      </button>
      <button type="button" className={BUTTON} onClick={() => setNote("Google")}>
        <GoogleMark />
        {verb} with Google
      </button>
      {onEmail ? (
        <button type="button" className={BUTTON} onClick={onEmail}>
          <Mail className="size-4" aria-hidden="true" />
          {verb} with email
        </button>
      ) : null}
      {note ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground" role="status">
          {note} sign-in: {NOTE}
        </p>
      ) : null}
    </div>
  );
}
