import { HOW_IT_WORKS } from "../../../constants";
import { CreatorAvatar } from "../../shared/CreatorAvatar";
import { MockFrame } from "./MockFrame";

const TONE: Record<string, string> = {
  "Draft ready": "bg-muted text-foreground/70",
  Scheduled: "bg-brand-soft text-brand",
  Live: "bg-success/10 text-success",
};

export function CollaborationMock() {
  return (
    <MockFrame>
      <ul className="space-y-2">
        {HOW_IT_WORKS.collaborations.map((row) => (
          <li key={row.name} className="flex items-center gap-2">
            <CreatorAvatar name={row.name} className="size-6" />
            <span className="flex-1 text-[0.7rem] font-semibold">{row.name}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-semibold ${TONE[row.status] ?? ""}`}>{row.status}</span>
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}
