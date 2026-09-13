import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

type Props = { href: string; label: string; variant?: "primary" | "secondary" | "ghost" | "brand"; className?: string; arrow?: boolean };

const VARIANTS = {
  primary: "bg-foreground text-background hover:bg-foreground/85 px-6",
  brand: "bg-brand text-brand-foreground hover:bg-brand/90 px-6",
  secondary: "btn-glass text-foreground px-6",
  ghost: "btn-glass text-foreground px-4",
} as const;

// naano's rounded pill buttons, as real links.
export function PillLink({ href, label, variant = "primary", className, arrow = true }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
        VARIANTS[variant],
        className,
      )}
    >
      {label}
      {arrow ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
    </Link>
  );
}
