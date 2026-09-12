import type { ReactNode } from "react";
import { cn } from "cn";
import { Clouds } from "./Clouds";

type Props = { eyebrow?: string; title: string; sub?: string; children?: ReactNode; tone?: "sky" | "plain" | "navy"; align?: "center" | "left" };

const TONES = {
  sky: "bg-linear-to-b from-brand-sky via-brand-sky/60 via-50% to-background",
  plain: "bg-background",
  navy: "bg-linear-to-br from-foreground to-brand text-background",
} as const;

// Hero band for the static public pages.
export function PageHero({ eyebrow, title, sub, children, tone = "sky", align = "center" }: Props) {
  const navy = tone === "navy";
  return (
    <section className={cn("relative overflow-hidden", navy ? "" : "-mt-16 pt-16", TONES[tone])}>
      {tone === "sky" ? <Clouds /> : null}
      <div className={cn("relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28", align === "center" ? "flex flex-col items-center text-center" : "", navy ? "pt-16 sm:pt-20" : "")}>
        {eyebrow ? <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", navy ? "text-background/70" : "text-brand")}>{eyebrow}</p> : null}
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">{title}</h1>
        {sub ? <p className={cn("mt-6 max-w-2xl text-lg sm:text-xl", navy ? "text-background/80" : "text-foreground/70")}>{sub}</p> : null}
        {children}
      </div>
    </section>
  );
}
