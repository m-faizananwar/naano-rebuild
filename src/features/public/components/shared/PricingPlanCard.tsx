import { PRICING } from "../../constants";
import { GlassCard } from "../glass/GlassCard";
import { PillLink } from "./PillLink";

type Plan = (typeof PRICING.plans)[number];

export function PricingPlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <GlassCard title={plan.title} index={index + 1} order={index} className="p-8 sm:p-10">
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${plan.cta.primary ? "text-brand" : "text-muted-foreground"}`}>{plan.eyebrow}</p>
      <p className="mt-4 text-muted-foreground">{plan.body}</p>
      <p className="mt-8">
        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
        <span className="ml-2 text-sm text-muted-foreground">{plan.priceNote}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{plan.priceDetail}</p>
      <ul className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
        {plan.features.map((feature) => (
          <li key={feature} className="py-3.5 text-base">
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <PillLink href={plan.cta.href} label={plan.cta.label} variant={plan.cta.primary ? "primary" : "secondary"} />
      </div>
    </GlassCard>
  );
}
