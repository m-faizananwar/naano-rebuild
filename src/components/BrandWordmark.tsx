import { cn } from "cn";
import { BRAND } from "@/config/brand";

// Wordmark: the mark from public/logo.svg (black rounded square, white "a")
// plus BRAND.wordmark. `inverted` sits on the brand-coloured auth panel.
export function BrandWordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-lg font-bold tracking-tight", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static svg from public/, no optimisation needed */}
      <img src="/logo.svg" alt="" aria-hidden="true" className={cn("inline-block size-5 rounded-[6px]", inverted && "ring-1 ring-brand-foreground/60")} />
      <span className={cn("side-label", inverted ? "text-brand-foreground" : "text-foreground")}>{BRAND.wordmark}</span>
    </span>
  );
}
