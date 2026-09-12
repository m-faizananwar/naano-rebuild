import { ShieldCheck, Star } from "lucide-react";
import { HERO_LOGOS } from "../../../constants";
import { FOR_CREATORS } from "../../../page-copy";
import { Clouds } from "../../shared/Clouds";
import { CreatorAvatar } from "../../shared/CreatorAvatar";
import { FaqList } from "../../shared/FaqList";
import { LogoWall } from "../../shared/LogoWall";
import { PillLink } from "../../shared/PillLink";
import { SectionHeading } from "../../shared/SectionHeading";
import { StatTile } from "../../shared/StatTile";
import { CreatorMonetizeSection } from "./CreatorMonetizeSection";
import { CreatorPlatformSection } from "./CreatorPlatformSection";

const STARS = 5;

function Hero() {
  const { hero } = FOR_CREATORS;
  return (
    <section className="relative -mt-16 overflow-hidden bg-linear-to-b from-brand-sky via-brand-sky/70 via-55% to-background pt-16">
      <Clouds />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-36">
        <p className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-border/60">
          <span className="flex -space-x-1.5">
            {["Aya D", "Eric D", "Nada O"].map((name) => (
              <CreatorAvatar key={name} name={name} className="size-5 ring-1 ring-background" />
            ))}
          </span>
          {hero.badge}
        </p>
        <h1 className="mt-8 text-5xl font-bold tracking-[-0.04em] sm:text-7xl">{hero.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70 sm:text-xl">
          {hero.sub} <strong className="font-semibold text-foreground">{hero.subStrong}</strong>.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <PillLink href={hero.primary.href} label={hero.primary.label} />
          <PillLink href={hero.secondary.href} label={hero.secondary.label} variant="ghost" />
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-foreground/70">
          <ShieldCheck className="size-4" aria-hidden="true" />
          {hero.trust}
        </p>
        <p className="mt-10 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{hero.logosHeading}</p>
        <LogoWall logos={HERO_LOGOS} className="mt-4 justify-center" />
      </div>
    </section>
  );
}

export function ForCreatorsPage() {
  const { testimonial, results, faq, cta } = FOR_CREATORS;
  return (
    <>
      <Hero />
      <CreatorMonetizeSection />
      <CreatorPlatformSection />
      <section className="px-4 py-24 sm:px-6">
        <figure className="mx-auto max-w-3xl text-center">
          <p className="flex justify-center gap-1" aria-label={`${STARS} out of ${STARS} stars`}>
            {Array.from({ length: STARS }, (_, index) => (
              <Star key={index} className="size-4 fill-current text-amber-500" aria-hidden="true" />
            ))}
          </p>
          <blockquote className="mt-6 text-3xl font-medium leading-tight tracking-tight text-foreground/35 sm:text-5xl">
            “{testimonial.quote} <span className="text-brand">.</span>”
          </blockquote>
          <figcaption className="mt-10 flex flex-col items-center">
            <CreatorAvatar name={testimonial.author} className="size-20" />
            <p className="mt-4 font-semibold">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </figcaption>
        </figure>
      </section>
      <section className="px-4 pb-24 sm:px-6">
        <p className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-success">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
          {results.eyebrow}
        </p>
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-linear-to-b from-brand-soft/70 to-background p-4 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.stats.map((stat) => (
              <StatTile key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 pb-24 sm:px-6">
        <SectionHeading title={faq.title} sub={faq.sub} />
        <div className="mx-auto mt-10 max-w-3xl">
          <FaqList items={faq.items} />
        </div>
      </section>
      <section className="bg-brand-sky/60 px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{cta.eyebrow}</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-[-0.03em] sm:text-6xl">{cta.title}</h2>
        <p className="mt-6 text-lg text-foreground/70">{cta.sub}</p>
        <div className="mt-8">
          <PillLink href={cta.button.href} label={cta.button.label} />
        </div>
      </section>
    </>
  );
}
