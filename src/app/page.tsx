import { Rocket } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// Placeholder until the marketplace landing view exists. Its job is to prove
// the deploy pipeline end to end (fonts, tailwind, shadcn, routing).
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <Rocket className="size-10 text-primary" aria-hidden="true" />
      <h1 className="text-4xl font-semibold tracking-tight">naano rebuild</h1>
      <p className="max-w-md text-muted-foreground">
        Hello, world. This is the deployment smoke test — the product comes next.
      </p>
      <Link href="/api/health" className={buttonVariants({ variant: "outline" })}>
        Check /api/health
      </Link>
    </main>
  );
}
