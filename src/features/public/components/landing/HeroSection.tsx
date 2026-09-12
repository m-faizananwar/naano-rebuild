import { ShieldCheck } from "lucide-react";
import { HERO, HERO_LOGOS } from "../../constants";
import { Clouds } from "../shared/Clouds";
import { LinkedInMark } from "../shared/LinkedInMark";
import { LogoWall } from "../shared/LogoWall";
import { PillLink } from "../shared/PillLink";

export function HeroSection() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-linear-to-b from-brand-sky via-brand-sky/70 via-55% to-background pt-16">
      <Clouds />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-36">
        <p className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-border/60 backdrop-blur">
          <span aria-hidden="true" className="text-xs font-bold">
            𝕏
          </span>
          <LinkedInMark />
          {HERO.badge}
        </p>
        <h1 className="mt-8 text-5xl font-bold tracking-[-0.04em] text-foreground sm:text-7xl">{HERO.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70 sm:text-xl">{HERO.sub}</p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <PillLink href={HERO.primary.href} label={HERO.primary.label} />
          <PillLink href={HERO.secondary.href} label={HERO.secondary.label} variant="ghost" />
        </div>
        <p className="mt-10 inline-flex items-center gap-2 text-sm text-foreground/70">
          <ShieldCheck className="size-4" aria-hidden="true" />
          {HERO.trust}
        </p>
        <LogoWall logos={HERO_LOGOS} className="mt-8 justify-center" />
      </div>
    </section>
  );
}
