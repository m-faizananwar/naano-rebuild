import { GlassSection } from "../glass/GlassSection";
import { PRICING } from "../../constants";
import { PricingPlans } from "../shared/PricingPlans";

export function PricingSection() {
  return (
    <GlassSection id="pricing" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-5xl font-bold tracking-[-0.03em] sm:text-6xl">{PRICING.title}</h2>
        <p className="mt-6 text-xl font-semibold">{PRICING.sub}</p>
        <p className="mt-2 text-muted-foreground">{PRICING.body}</p>
        <div className="mt-12">
          <PricingPlans />
        </div>
      </div>
    </GlassSection>
  );
}
