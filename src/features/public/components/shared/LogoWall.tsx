import { cn } from "cn";

type Props = { logos: readonly string[]; more?: string; className?: string; size?: "sm" | "md"; marquee?: boolean };

// Text wordmarks in place of naano's client logo images.
export function LogoWall({ logos, more, className, size = "md", marquee = false }: Props) {
  if (marquee) {
    // Slow horizontal marquee: the list is doubled so the loop is seamless.
    const doubled = [...logos, ...logos];
    return (
      <div className={cn("w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]", className)} aria-label="Customer logos">
        <ul className="animate-marquee flex w-max items-center gap-x-12">
          {doubled.map((logo, i) => (
            <li key={`${logo}-${i}`} aria-hidden={i >= logos.length} className={cn("font-bold tracking-tight whitespace-nowrap text-foreground/55", size === "md" ? "text-lg" : "text-sm")}>
              {logo}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-8 gap-y-4", className)} aria-label="Customer logos">
      {logos.map((logo) => (
        <li key={logo} className={cn("font-bold tracking-tight text-foreground/55", size === "md" ? "text-lg" : "text-sm")}>
          {logo}
        </li>
      ))}
      {more ? <li className="rounded-full border px-3 py-0.5 text-xs font-medium text-muted-foreground">{more}</li> : null}
    </ul>
  );
}
