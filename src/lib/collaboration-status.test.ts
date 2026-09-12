import { describe, expect, it } from "vitest";
import {
  ACTORS,
  COLLABORATION_EVENTS,
  COLLABORATION_STATUSES,
  IllegalTransitionError,
  TRANSITIONS,
  allowedEvents,
  findTransition,
  nextStatus,
  pathTo,
} from "./collaboration-status";

// The table from docs/plan.md, written out independently of TRANSITIONS so
// the test fails if either side drifts.
const EXPECTED: Array<[from: string | null, event: string, actor: string, to: string]> = [
  [null, "invite", "brand", "invited"],
  [null, "apply", "creator", "applied"],
  ["invited", "accept", "creator", "accepted"],
  ["invited", "decline", "creator", "declined"],
  ["applied", "accept", "brand", "accepted"],
  ["applied", "decline", "brand", "declined"],
  ["accepted", "submit_draft", "creator", "draft_submitted"],
  ["draft_submitted", "approve", "brand", "approved"],
  ["draft_submitted", "request_changes", "brand", "changes_requested"],
  ["changes_requested", "submit_draft", "creator", "draft_submitted"],
  ["approved", "schedule", "creator", "scheduled"],
  ["scheduled", "publish", "creator", "live"],
  ["live", "pay", "system", "paid"],
  ["live", "pay", "brand", "paid"],
];

type From = Parameters<typeof nextStatus>[0];
type Event = Parameters<typeof nextStatus>[1];
type Actor = Parameters<typeof nextStatus>[2];

describe("collaboration state machine", () => {
  it("allows exactly the transitions in the plan", () => {
    expect(TRANSITIONS).toHaveLength(EXPECTED.length);
    for (const [from, event, actor, to] of EXPECTED) {
      expect(nextStatus(from as From, event as Event, actor as Actor)).toBe(to);
    }
  });

  it("throws on every combination that is not in the table", () => {
    const allowed = new Set(EXPECTED.map(([f, e, a]) => `${f}|${e}|${a}`));
    const froms: From[] = [null, ...COLLABORATION_STATUSES];
    const combos = froms.flatMap((from) =>
      COLLABORATION_EVENTS.flatMap((event) => ACTORS.map((actor) => [from, event, actor] as const)),
    );
    const illegal = combos.filter(([from, event, actor]) => !allowed.has(`${from}|${event}|${actor}`));
    for (const [from, event, actor] of illegal) {
      expect(() => nextStatus(from, event, actor)).toThrow(IllegalTransitionError);
      expect(findTransition(from, event, actor)).toBeNull();
    }
    expect(illegal).toHaveLength(combos.length - EXPECTED.length);
  });

  it("terminal states have no outgoing events for anyone", () => {
    for (const actor of ACTORS) {
      expect(allowedEvents("declined", actor)).toEqual([]);
      expect(allowedEvents("paid", actor)).toEqual([]);
    }
  });

  it("only the counterpart can answer an invitation or an application", () => {
    expect(allowedEvents("invited", "creator")).toEqual(["accept", "decline"]);
    expect(allowedEvents("invited", "brand")).toEqual([]);
    expect(allowedEvents("applied", "brand")).toEqual(["accept", "decline"]);
    expect(allowedEvents("applied", "creator")).toEqual([]);
  });

  it("builds fixture paths through the same rules", () => {
    expect(pathTo("paid", "invitation").map((t) => t.event)).toEqual([
      "invite", "accept", "submit_draft", "approve", "schedule", "publish", "pay",
    ]);
    expect(pathTo("changes_requested", "application").map((t) => t.to)).toEqual([
      "applied", "accepted", "draft_submitted", "changes_requested",
    ]);
    expect(() => pathTo("applied", "invitation")).toThrow();
  });
});
