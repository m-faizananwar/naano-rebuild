import { Check } from "lucide-react";
import { HOW_IT_WORKS } from "../../../constants";
import { MockFrame } from "./MockFrame";

export function BriefMock() {
  const { brief } = HOW_IT_WORKS;
  return (
    <MockFrame>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">{brief.title}</p>
        <span className="rounded-full bg-brand px-1.5 py-0.5 text-[0.55rem] font-bold text-brand-foreground">{brief.tag}</span>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {brief.items.map((item) => (
          <li key={item} className="flex items-center gap-1.5 text-[0.65rem] text-foreground/80">
            <span className="flex size-3.5 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Check className="size-2.5" aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-3 h-1 rounded-full bg-muted">
        <div className="h-full w-4/5 rounded-full bg-brand" />
      </div>
    </MockFrame>
  );
}
