import { Check } from "lucide-react";
import { HOW_IT_WORKS } from "../../../constants";
import { MockFrame } from "./MockFrame";

export function PayoutMock() {
  const { payout } = HOW_IT_WORKS;
  return (
    <MockFrame>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Check className="size-3" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold leading-tight">{payout.title}</p>
          <p className="text-[0.6rem] text-muted-foreground">{payout.sub}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-lg bg-muted/60 px-2 py-1.5">
        <span className="text-[0.6rem] text-muted-foreground">{payout.label}</span>
        <span className="text-sm font-bold">{payout.value}</span>
      </div>
      <ul className="mt-2 flex gap-1">
        {payout.chips.map((chip) => (
          <li key={chip} className="rounded-full bg-muted px-1.5 py-0.5 text-[0.55rem] text-muted-foreground">
            {chip}
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}
