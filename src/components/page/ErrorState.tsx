import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Props = { title?: string; body: string; retryHref?: string };

// Shown when a query fails. The real error is logged server-side; this only
// tells the user what to do next.
export function ErrorState({ title = "Something went wrong", body, retryHref }: Props) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
      {retryHref ? (
        <Link href={retryHref} className={buttonVariants({ variant: "outline", className: "mt-6" })}>
          Try again
        </Link>
      ) : null}
    </div>
  );
}
