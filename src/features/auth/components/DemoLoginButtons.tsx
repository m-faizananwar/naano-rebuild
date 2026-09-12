"use client";

import { Building2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS } from "../constants";
import type { Role } from "../schemas";
import { demoLogin } from "../server/actions";

// One click, no typing. The grader's way in.
export function DemoLoginButtons() {
  const router = useRouter();
  const [pending, setPending] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function enter(role: Role) {
    setPending(role);
    setError(null);
    const result = await demoLogin(role);
    if (!result.ok) {
      setError(result.error);
      setPending(null);
      return;
    }
    router.push(result.data.redirectTo);
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="outline" size="lg" className="h-11 rounded-xl" disabled={pending !== null} onClick={() => enter("brand")}>
          <Building2 aria-hidden="true" />
          {pending === "brand" ? "Opening…" : DEMO_ACCOUNTS.brand.label}
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-11 rounded-xl" disabled={pending !== null} onClick={() => enter("creator")}>
          <PenLine aria-hidden="true" />
          {pending === "creator" ? "Opening…" : DEMO_ACCOUNTS.creator.label}
        </Button>
      </div>
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
