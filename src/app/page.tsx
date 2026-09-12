import { Rocket } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// Placeholder until the marketplace landing view exists (build step 4).
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <Rocket className="size-10 text-brand" aria-hidden="true" />
      <h1 className="text-4xl font-semibold tracking-tight">The B2B LinkedIn Creator Marketplace.</h1>
      <p className="max-w-md text-muted-foreground">
        Rebuild in progress. Sign in as a demo brand or creator to click through the workspaces.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/login" className={buttonVariants()}>
          Sign in
        </Link>
        <Link href="/register" className={buttonVariants({ variant: "outline" })}>
          Sign up
        </Link>
        <Link href="/api/health" className={buttonVariants({ variant: "ghost" })}>
          /api/health
        </Link>
      </div>
    </main>
  );
}
