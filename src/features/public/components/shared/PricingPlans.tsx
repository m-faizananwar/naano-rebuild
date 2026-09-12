import { ShieldCheck } from "lucide-react";
import { PRICING } from "../../constants";
import { PricingPlanCard } from "./PricingPlanCard";

export function PricingPlans() {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        {PRICING.plans.map((plan) => (
          <PricingPlanCard key={plan.eyebrow} plan={plan} />
        ))}
      </div>
      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" />
        {PRICING.footnote}
      </p>
    </div>
  );
}
