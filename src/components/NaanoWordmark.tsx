import { cn } from "cn";

// Text wordmark stand-in for naano's logo mark.
export function NaanoWordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-lg font-bold tracking-tight", className)}>
      <span
        aria-hidden="true"
        className={cn("inline-block size-5 rounded-[6px]", inverted ? "bg-brand-foreground" : "bg-foreground")}
      />
      <span className={cn("side-label", inverted ? "text-brand-foreground" : "text-foreground")}>naano</span>
    </span>
  );
}
