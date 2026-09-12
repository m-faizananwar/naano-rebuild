import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { CASE_STUDY, LOGO_WALL, LOGO_WALL_MORE } from "../../constants";
import { CreatorAvatar } from "../shared/CreatorAvatar";
import { LogoWall } from "../shared/LogoWall";

export function CaseStudySection() {
  return (
    <section className="bg-background px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{CASE_STUDY.eyebrow}</h2>
        <p className="mt-3 text-lg text-muted-foreground">{CASE_STUDY.sub}</p>
        <div className="mt-10 grid gap-6 rounded-[2rem] bg-linear-to-br from-background to-brand-soft/60 p-4 ring-1 ring-border/60 sm:p-8 lg:grid-cols-[2fr_3fr]">
          <div className="rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border/60">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{CASE_STUDY.videoLabel}</p>
            <div className="relative mt-4 flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-brand-sky via-brand-soft to-muted">
              <span className="flex size-16 items-center justify-center rounded-full bg-background/90 shadow-md" aria-hidden="true">
                <Play className="ml-1 size-6 fill-current" />
              </span>
              <span className="absolute bottom-3 right-3 rounded-md bg-foreground/80 px-2 py-0.5 text-xs font-semibold text-background">{CASE_STUDY.duration}</span>
              <span className="absolute bottom-3 left-3 text-xs font-medium text-foreground/70">Video poster · no playback in this build</span>
            </div>
            <blockquote className="mt-5 text-xl font-semibold leading-snug tracking-tight">“{CASE_STUDY.quote}”</blockquote>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-brand-soft/70 p-3">
              <CreatorAvatar name={CASE_STUDY.author} className="size-10" />
              <div>
                <p className="text-sm font-semibold">{CASE_STUDY.author}</p>
                <p className="text-xs text-muted-foreground">{CASE_STUDY.role}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Case study</p>
              <p className="text-lg font-bold tracking-tight">{CASE_STUDY.brand}</p>
            </div>
            <h3 className="mt-4 text-2xl font-bold tracking-tight">{CASE_STUDY.title}</h3>
            <p className="mt-3 text-muted-foreground">{CASE_STUDY.body}</p>
            <dl className="mt-6 grid grid-cols-3 divide-x border-y py-5">
              {CASE_STUDY.stats.map((stat) => (
                <div key={stat.label} className="px-3 first:pl-0">
                  <dd className="text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</dd>
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <Link href={CASE_STUDY.link.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:underline">
              {CASE_STUDY.link.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="mt-8 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{CASE_STUDY.logosHeading}</p>
            <LogoWall logos={LOGO_WALL} more={LOGO_WALL_MORE} size="sm" className="mt-4 gap-x-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
