"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";

// Render-time error boundary for Brand › Creators; the cause is logged, the
// user gets a way back.
export default function CreatorsError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error("[brand/creators] render error", error.digest ?? error.message);
  }, [error]);
  return (
    <>
      <PageHeader title="Creators" />
      <ErrorState body="Something broke while showing the creators. Reload to try again." retryHref="/brand/creators" />
    </>
  );
}
