import { cn } from "cn";

type Props = { logos: readonly string[]; more?: string; className?: string; size?: "sm" | "md" };

// Text wordmarks in place of naano's client logo images.
export function LogoWall({ logos, more, className, size = "md" }: Props) {
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
