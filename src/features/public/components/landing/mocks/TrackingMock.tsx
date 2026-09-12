import { HOW_IT_WORKS } from "../../../constants";
import { MockFrame } from "./MockFrame";

const BARS = [30, 45, 38, 55, 48, 85, 100];
const FILLED_FROM = 5;

export function TrackingMock() {
  const { tracking } = HOW_IT_WORKS;
  return (
    <MockFrame>
      <p className="text-[0.6rem] text-muted-foreground">{tracking.label}</p>
      <p className="text-xl font-bold tracking-tight">
        {tracking.value} <span className="rounded-full bg-success/10 px-1.5 text-[0.55rem] font-semibold text-success">{tracking.delta}</span>
      </p>
      <div className="mt-2 flex h-10 items-end gap-1" aria-hidden="true">
        {BARS.map((height, index) => (
          <div key={index} className={`flex-1 rounded-sm ${index >= FILLED_FROM ? "bg-brand" : "bg-brand-sky"}`} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[0.6rem] text-muted-foreground">
        <span>{tracking.views}</span>
        <span>{tracking.leads}</span>
      </div>
    </MockFrame>
  );
}
