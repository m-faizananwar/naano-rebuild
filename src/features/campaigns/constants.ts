import type { CollaborationStatus } from "@/lib/collaboration-status";

import { BRAND } from "@/config/brand";
// naano's 24 industries, verbatim from the creator onboarding (product map).
// Copied from scripts/seed/taxonomy.ts on purpose: features never import seeds.
export const INDUSTRIES = [
  "B2B", "B2C", "AI", "SaaS", "Sales", "Marketing", "SEO", "Outreach", "CRM", "Creative", "Productivity",
  "Fintech", "HealthTech", "EdTech", "Cybersecurity", "Growth / GTM", "HR", "E-commerce", "Developer Tools",
  "Data / Analytics", "Customer Support", "Design", "Real Estate / PropTech", "LegalTech",
] as const;

// Settings › Audience regions, in the product's order.
export const GEOGRAPHIES = ["Europe", "North America", "Latin America", "Asia", "Africa", "Oceania", "Middle East", "Worldwide"] as const;

export const CAMPAIGN_STATUS_LABEL = { draft: "Draft", active: "Active", completed: "Completed" } as const;

// Brand collaboration sub-tabs (product map, "Campaign detail"), in order.
export const COLLAB_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "received", label: "Invitations received" },
  { key: "sent", label: "Invitations sent" },
  { key: "todo", label: "To do" },
  { key: "completed", label: "Completed" },
] as const;
export type CollabTabKey = (typeof COLLAB_TABS)[number]["key"];

export const COLLAB_TAB_STATUSES: Record<Exclude<CollabTabKey, "all">, readonly CollaborationStatus[]> = {
  active: ["accepted", "changes_requested", "approved", "scheduled", "live"],
  received: ["applied"],
  sent: ["invited"],
  todo: ["draft_submitted"],
  completed: ["paid"],
};

export const COLLAB_STATUS_LABEL: Record<CollaborationStatus, string> = {
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

// "Next action" column, from the brand's point of view.
export const COLLAB_NEXT_ACTION: Record<CollaborationStatus, string> = {
  invited: "Waiting for the creator to accept",
  applied: "Review the application",
  accepted: "Creator is writing the draft",
  declined: "No further action",
  draft_submitted: "Review the LinkedIn post",
  changes_requested: "Creator is revising the draft",
  approved: "Creator schedules the post",
  scheduled: "Post goes live on the scheduled date",
  live: `Payment scheduled · Handled by ${BRAND.name}`,
  paid: "Completed",
};

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_ROWS_PER_PAGE = 10;

export const ANALYTICS_DAYS = 12;
export const BEST_FIT_LIMIT = 12;
export const DEFAULT_SELECTED_CREATORS = 4;
export const AI_HISTORY_LIMIT = 20;
export const DEFAULT_POST_DEADLINE_DAYS = 14;
export const DAY_MS = 86_400_000;
export const DEFAULT_FEE_CENTS = 30_000;
export const MAX_FEE_CENTS = 150_000;

export const LAUNCH_STEPS = [
  { key: "basics", label: "Basics" },
  { key: "brief", label: "Brief" },
  { key: "creators", label: "Pick creators" },
  { key: "review", label: "Review & launch" },
] as const;
export type LaunchStepKey = (typeof LAUNCH_STEPS)[number]["key"];

// AI brief generation (features/campaigns/server/brief-ai.ts).
export const BRIEF_AI_MAX_TOKENS = 4_000;
export const BRIEF_AI_TIMEOUT_MS = 45_000;
export const BRIEF_PROMPT_MAX_CHARS = 1_000;
export const BRIEF_TEXT_MAX_CHARS = 4_000;
export const BRIEF_LIST_MAX_ITEMS = 12;
export const BRIEF_ANGLES_MAX = 6;
export const CAMPAIGN_NAME_MAX_CHARS = 120;
export const CAMPAIGN_DESCRIPTION_MAX_CHARS = 400;
export const LINK_URL_MAX_CHARS = 2_000;

export const TEMPLATE_NOTE = "Prepared from a template — add ANTHROPIC_API_KEY or GEMINI_API_KEY for AI briefs";
export const AI_NOTE = "Generated with AI";
export const LINK_NOTE = "We couldn't read the link in this build, so we prepared the brief from your workspace profile";
