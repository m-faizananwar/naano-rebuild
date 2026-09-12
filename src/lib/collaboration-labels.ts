// Status → label / tab / next action, for both sides of the marketplace.
// Pure: the views and the queries both read from here so the table, the
// detail page and the tab counts can never disagree.
import type { CollaborationStatus } from "./collaboration-status";

export const STATUS_LABELS: Record<CollaborationStatus, string> = {
  invited: "Invited",
  applied: "Applied",
  accepted: "Accepted",
  declined: "Declined",
  draft_submitted: "Draft ready",
  changes_requested: "Changes requested",
  approved: "Approved",
  scheduled: "Scheduled",
  live: "Live",
  paid: "Paid",
};

export type StatusTone = "neutral" | "info" | "warning" | "success" | "danger";

export const STATUS_TONES: Record<CollaborationStatus, StatusTone> = {
  invited: "info",
  applied: "info",
  accepted: "info",
  declined: "danger",
  draft_submitted: "warning",
  changes_requested: "warning",
  approved: "info",
  scheduled: "info",
  live: "success",
  paid: "success",
};

// A message thread exists once a booking is accepted, on both sides.
export const THREAD_STATUSES: readonly CollaborationStatus[] = [
  "accepted",
  "draft_submitted",
  "changes_requested",
  "approved",
  "scheduled",
  "live",
  "paid",
];

// Statuses with a published post: the clicks column means something.
export const PERFORMANCE_STATUSES: readonly CollaborationStatus[] = ["live", "paid"];

// ---- creator tabs ---------------------------------------------------------

export const CREATOR_TABS = ["all", "active", "needs_action", "applications_sent", "declined", "completed"] as const;
export type CreatorTab = (typeof CREATOR_TABS)[number];

export const CREATOR_TAB_LABELS: Record<CreatorTab, string> = {
  all: "All",
  active: "Active",
  needs_action: "Needs action",
  applications_sent: "Applications sent",
  declined: "Declined",
  completed: "Completed",
};

const CREATOR_TAB_BY_STATUS: Record<CollaborationStatus, Exclude<CreatorTab, "all">> = {
  invited: "needs_action",
  changes_requested: "needs_action",
  approved: "needs_action",
  applied: "applications_sent",
  accepted: "active",
  draft_submitted: "active",
  scheduled: "active",
  live: "active",
  declined: "declined",
  paid: "completed",
};

export function creatorTabFor(status: CollaborationStatus): Exclude<CreatorTab, "all"> {
  return CREATOR_TAB_BY_STATUS[status];
}

// ---- brand tabs -----------------------------------------------------------

export const BRAND_TABS = ["all", "active", "invitations_received", "invitations_sent", "to_do", "completed"] as const;
export type BrandTab = (typeof BRAND_TABS)[number];

export const BRAND_TAB_LABELS: Record<BrandTab, string> = {
  all: "All",
  active: "Active",
  invitations_received: "Invitations received",
  invitations_sent: "Invitations sent",
  to_do: "To do",
  completed: "Completed",
};

// declined is only listed under "All".
const BRAND_TAB_BY_STATUS: Record<CollaborationStatus, Exclude<BrandTab, "all"> | null> = {
  invited: "invitations_sent",
  applied: "invitations_received",
  draft_submitted: "to_do",
  accepted: "active",
  changes_requested: "active",
  approved: "active",
  scheduled: "active",
  live: "active",
  paid: "completed",
  declined: null,
};

export function brandTabFor(status: CollaborationStatus): Exclude<BrandTab, "all"> | null {
  return BRAND_TAB_BY_STATUS[status];
}

// "all" counts every row; the other tabs count what tabFor assigns them.
export function countByTab<T extends string>(
  statuses: readonly CollaborationStatus[],
  tabs: readonly T[],
  tabFor: (status: CollaborationStatus) => T | null,
): Record<T, number> {
  const counts: Record<string, number> = Object.fromEntries(tabs.map((t) => [t, 0]));
  for (const status of statuses) {
    const tab = tabFor(status);
    if (tab && tab in counts) counts[tab] += 1;
    if ("all" in counts) counts.all += 1;
  }
  return counts as Record<T, number>;
}

// ---- time left ------------------------------------------------------------

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const HOURS_SHOWN_AS_HOURS = 48;

// "36h left", "3d left", "12m left", "expired".
export function timeLeftLabel(until: string | null, now: number | Date = Date.now()): string | null {
  if (!until) return null;
  const nowMs = typeof now === "number" ? now : now.getTime();
  const remaining = new Date(until).getTime() - nowMs;
  if (Number.isNaN(remaining)) return null;
  if (remaining <= 0) return "expired";
  if (remaining < HOUR_MS) return `${Math.max(1, Math.ceil(remaining / MINUTE_MS))}m left`;
  const hours = Math.ceil(remaining / HOUR_MS);
  if (hours < HOURS_SHOWN_AS_HOURS) return `${hours}h left`;
  return `${Math.ceil(remaining / DAY_MS)}d left`;
}

// ---- next action ------------------------------------------------------------

export type NextActionInput = {
  status: CollaborationStatus;
  acceptBy: string | null;
  revisionRound: number;
  maxRevisionRounds: number;
  now?: number | Date;
};

function withTimeLeft(label: string, until: string | null, now?: number | Date) {
  const left = timeLeftLabel(until, now);
  return left ? `${label} · ${left}` : label;
}

export function creatorNextAction(input: NextActionInput): string {
  switch (input.status) {
    case "invited":
      return withTimeLeft("Accept or decline", input.acceptBy, input.now);
    case "applied":
      return "Waiting for the brand";
    case "accepted":
      return "Submit your draft";
    case "draft_submitted":
      return "Waiting for review";
    case "changes_requested":
      return `Update your draft (round ${input.revisionRound} of ${input.maxRevisionRounds})`;
    case "approved":
      return "Schedule the post";
    case "scheduled":
      return "Publish and add the post URL";
    case "live":
      return "Awaiting payment";
    case "paid":
      return "Paid";
    case "declined":
      return "Declined";
  }
}

export function brandNextAction(input: NextActionInput): string {
  switch (input.status) {
    case "invited":
      return withTimeLeft("Waiting for the creator", input.acceptBy, input.now);
    case "applied":
      return "Accept or decline the application";
    case "accepted":
      return "Creator is drafting";
    case "draft_submitted":
      return "Review the draft";
    case "changes_requested":
      return `Creator is revising (round ${input.revisionRound} of ${input.maxRevisionRounds})`;
    case "approved":
      return "Creator schedules the post";
    case "scheduled":
      return "Waiting for publication";
    case "live":
      return "Pay the creator";
    case "paid":
      return "Paid";
    case "declined":
      return "Declined";
  }
}
