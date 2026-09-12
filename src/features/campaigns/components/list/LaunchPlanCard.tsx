import { LaunchPlanPopover } from "../LaunchPlanPopover";
import type { LaunchPlanDto } from "../../schemas";

// The GET STARTED checklist as a card, so it is reachable before the shell
// mounts it in the top bar.
export function LaunchPlanCard({ plan }: { plan: LaunchPlanDto }) {
  return (
    <aside className="rounded-2xl border bg-background p-5">
      <LaunchPlanPopover plan={plan} />
    </aside>
  );
}
