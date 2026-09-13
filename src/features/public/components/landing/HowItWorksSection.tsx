import { HOW_IT_WORKS } from "../../constants";
import { GlassCard } from "../glass/GlassCard";
import { GlassSection } from "../glass/GlassSection";
import { BriefMock } from "./mocks/BriefMock";
import { CollaborationMock } from "./mocks/CollaborationMock";
import { FindCreatorsMock } from "./mocks/FindCreatorsMock";
import { PayoutMock } from "./mocks/PayoutMock";
import { TrackingMock } from "./mocks/TrackingMock";

const MOCKS = [FindCreatorsMock, BriefMock, CollaborationMock, TrackingMock, PayoutMock];

export function HowItWorksSection() {
  return (
    <GlassSection id="how-it-works" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          {HOW_IT_WORKS.eyebrow}
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="max-w-xl text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{HOW_IT_WORKS.title}</h2>
          <p className="max-w-sm text-lg text-muted-foreground">{HOW_IT_WORKS.sub}</p>
        </div>
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_IT_WORKS.steps.map((step, index) => {
            const Mock = MOCKS[index];
            return (
              <GlassCard key={step.n} as="li" title={step.label} index={index + 1} order={index} className="p-5">
                <div className="card-keep flex min-h-44 flex-1 items-center justify-center">{Mock ? <Mock /> : null}</div>
              </GlassCard>
            );
          })}
        </ol>
      </div>
    </GlassSection>
  );
}
