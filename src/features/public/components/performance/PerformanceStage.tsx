"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Beam } from "@/components/motion/Beam";
import { STAGE_COPY, STAGE_MEDIA } from "./performance-copy";
import { ConnectionsMapArt, ContextWallArt, GaugeArt, PaperTexture, StageFilterDefs } from "./StageArt";
import { usePerformanceStage } from "./usePerformanceStage";
import "./performance.css";
type CardKey = keyof typeof STAGE_COPY.cards;

// The landing's results section as the metric-cards stage
// (docs/reference/metric-cards-spec.md): same three cards, same everything,
// our numbers in the LED-dot type. A 100svh block inside the scrolling page
// with its own paper background and both stage videos.
export function PerformanceStage() {
  const root = useRef<HTMLElement>(null);
  usePerformanceStage(root);
  const c = STAGE_COPY;
  return (
    <section ref={root} className="perf" aria-labelledby="perf-title">
      <video className="stage-motion stage-motion--wide" autoPlay muted loop playsInline preload="auto" aria-hidden="true" poster={STAGE_MEDIA.wide.poster} src={STAGE_MEDIA.wide.src} />
      <video className="stage-motion stage-motion--narrow" autoPlay muted loop playsInline preload="none" aria-hidden="true" poster={STAGE_MEDIA.narrow.poster} src={STAGE_MEDIA.narrow.src} />
      <PaperTexture />
      <StageFilterDefs />

      <header className="masthead">
        <h2 id="perf-title" className="headline">
          <span className="headline__line">{c.headline.lead}<span className="dot-word" data-dots={c.headline.dots} aria-label={c.headline.dots} /></span>
          <span className="headline__line">{c.headline.line2}</span>
        </h2>
        <p className="intro">{c.intro[0]}<br className="desktop-break" />{c.intro[1]}<br className="desktop-break" />{c.intro[2]}</p>
      </header>

      <div className="cards" role="list" aria-label="Results">
        <MetricCard kind="speed"><GaugeArt /></MetricCard>
        <MetricCard kind="context">
          <div className="context-glow" aria-hidden="true"><ContextWallArt /></div>
          <div className="context-window" aria-hidden="true">
            <svg className="context-window__grain" viewBox="0 0 252 166" preserveAspectRatio="none"><rect width="252" height="166" filter="url(#panelNoiseF)" /></svg>
            <div className="window-lines"><span /><span /><span /></div>
          </div>
        </MetricCard>
        <MetricCard kind="connections"><ConnectionsMapArt /></MetricCard>
      </div>
    </section>
  );
}

function MetricCard({ kind, children }: { kind: CardKey; children: React.ReactNode }) {
  const card = STAGE_COPY.cards[kind];
  const media = STAGE_MEDIA[kind];
  const [hover, setHover] = useState(false);
  return (
    <Beam size="md" strength={0.6} active={hover} className="card-beam" role="listitem">
    <article className={`card card--${kind}`} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <video className="card__media" autoPlay muted loop playsInline preload="auto" aria-hidden="true" poster={media.poster} src={media.src} />
      {kind === "context" ? children : null}
      <svg className="card__grain" viewBox="0 0 429 554" preserveAspectRatio="none" aria-hidden="true"><rect width="429" height="554" filter="url(#cardNoise)" /></svg>
      <h3 className="card__title">{card.title[0]}<br />{card.title[1]}</h3>
      {kind === "context" ? null : children}
      <div className={`metric metric--${kind}`}><span className="dot-number" data-dots={card.dots} aria-label={card.dots} /><span className="metric__unit">{card.unit}</span></div>
      <p className="caption">{card.caption[0]}<br />{card.caption[1]}</p>
      <Link className="learn-more" href={STAGE_COPY.learnMore.href}>{STAGE_COPY.learnMore.label}</Link>
    </article>
    </Beam>
  );
}
