import { HOW_IT_WORKS } from "../../constants";
import { BriefMock } from "./mocks/BriefMock";
import { CollaborationMock } from "./mocks/CollaborationMock";
import { FindCreatorsMock } from "./mocks/FindCreatorsMock";
import { PayoutMock } from "./mocks/PayoutMock";
import { TrackingMock } from "./mocks/TrackingMock";

const MOCKS = [FindCreatorsMock, BriefMock, CollaborationMock, TrackingMock, PayoutMock];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-linear-to-b from-background via-brand-soft/60 to-background px-4 py-24 sm:px-6">
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
              <li key={step.n} className="flex flex-col rounded-2xl bg-background/70 p-4 ring-1 ring-border/50">
                <span className="w-fit rounded-full bg-background px-2.5 py-0.5 text-[0.65rem] font-bold text-brand ring-1 ring-brand/30">{step.n}</span>
                <div className="my-6 flex min-h-44 items-center justify-center">{Mock ? <Mock /> : null}</div>
                <h3 className="text-base font-semibold leading-snug">{step.label}</h3>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
