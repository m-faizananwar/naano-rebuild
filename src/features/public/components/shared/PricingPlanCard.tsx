import { PRICING } from "../../constants";
import { PillLink } from "./PillLink";

type Plan = (typeof PRICING.plans)[number];

export function PricingPlanCard({ plan }: { plan: Plan }) {
  return (
    <article className="glass-card frost-card flex flex-col rounded-[48px] bg-card p-8 shadow-sm sm:p-10">
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${plan.cta.primary ? "text-brand" : "text-muted-foreground"}`}>{plan.eyebrow}</p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight">{plan.title}</h3>
      <p className="mt-6 text-muted-foreground">{plan.body}</p>
      <p className="mt-8">
        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
        <span className="ml-2 text-sm text-muted-foreground">{plan.priceNote}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{plan.priceDetail}</p>
      <ul className="mt-8 divide-y border-y">
        {plan.features.map((feature) => (
          <li key={feature} className="py-3.5 text-base">
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <PillLink href={plan.cta.href} label={plan.cta.label} variant={plan.cta.primary ? "primary" : "secondary"} />
      </div>
    </article>
  );
}
