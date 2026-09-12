import { ChevronDown } from "lucide-react";

// Native disclosure: keyboard reachable, no JS, no accordion dependency.
export function FaqItem({ q, a, open = false }: { q: string; a: string; open?: boolean }) {
  return (
    <details className="accordion group border-b py-1" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-5 text-lg font-medium marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="[--accordion-height:10rem]">
        <p className="max-w-2xl pb-6 text-base/relaxed text-muted-foreground">{a}</p>
      </div>
    </details>
  );
}
