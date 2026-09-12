import { BRAND } from "@/config/brand";
// The brief drawer's two copy buttons: "Copy as Markdown" and "Copy for my AI".
// Pure text builders over the brief document the queries assemble.

export type BriefAngleDoc = { angle: string; hook: string; direction: string; example: string };

export type BriefDoc = {
  campaignName: string;
  campaignDescription: string;
  brandCompany: string;
  brandWebsite: string | null;
  valueProp: string | null;
  icpTitles: string[];
  whatToTell: string;
  targetIndustries: string[];
  targetGeos: string[];
  tone: string;
  do: string[];
  avoid: string[];
  links: string[];
  angles: BriefAngleDoc[];
  // The creator's tracked link once the booking exists; null before that.
  trackedUrl: string | null;
  postDeadline: string | null;
};

function bullets(items: string[]) {
  return items.length > 0 ? items.map((i) => `- ${i}`).join("\n") : "- (none)";
}

const H1 = 1;
const H2 = 2;
const H3 = 3;
const ISO_DATE_LENGTH = "YYYY-MM-DD".length;

function heading(level: number, text: string) {
  return `${"#".repeat(level)} ${text}`;
}

export function primaryCta(doc: BriefDoc) {
  const link = doc.trackedUrl ?? doc.links[0] ?? doc.brandWebsite ?? "";
  const suffix = doc.trackedUrl ? ` (your tracked ${BRAND.name} link)` : "";
  return link ? `Send readers to ${link}${suffix}` : "Send readers to the brand's site";
}

export function briefToMarkdown(doc: BriefDoc): string {
  const lines: string[] = [
    heading(H1, doc.campaignName),
    `${doc.brandCompany}${doc.brandWebsite ? ` · ${doc.brandWebsite}` : ""}`,
    "",
    heading(H2, "Campaign objectives"),
    doc.whatToTell,
    "",
    `Primary CTA: ${primaryCta(doc)}`,
    "Secondary win: comments and DMs from the right people.",
    "",
    heading(H2, "Target audience"),
    `Brand: ${doc.brandCompany}${doc.campaignDescription ? ` — ${doc.campaignDescription}` : ""}`,
    `Why we exist: ${doc.valueProp ?? "(not provided)"}`,
    "ICP (who the creator is talking to):",
    bullets(doc.icpTitles),
    `Industries: ${doc.targetIndustries.join(", ") || "(any)"} · Regions: ${doc.targetGeos.join(", ") || "(any)"}`,
    "Proof points to lean on:",
    bullets(doc.links),
    "",
    heading(H2, "Call to action"),
    "Do:",
    bullets(doc.do),
    "Don't:",
    bullets(doc.avoid),
    `Tone: ${doc.tone}`,
    "",
    heading(H2, `Content angles · ${doc.angles.length}`),
    ...doc.angles.flatMap((a, i) => [
      heading(H3, `${i + 1}. ${a.angle}`),
      `Hook: ${a.hook}`,
      `Editorial direction: ${a.direction}`,
      "Post example:",
      a.example,
      "",
    ]),
  ];
  if (doc.postDeadline) lines.push(`Post deadline: ${doc.postDeadline.slice(0, ISO_DATE_LENGTH)}`);
  return lines.join("\n").trim();
}

export function briefToAiPrompt(doc: BriefDoc): string {
  return [
    "You are helping me write a sponsored LinkedIn post. Write in my voice, first person, short lines, one clear CTA near the end.",
    "Use only the facts in the brief below. Do not invent customers, numbers or features. Disclose the partnership clearly.",
    "If you do not know my style yet, ask me for 2 or 3 of my previous posts before writing.",
    "",
    "--- BRIEF ---",
    briefToMarkdown(doc),
    "--- END BRIEF ---",
    "",
    "Deliver: one LinkedIn post (150–250 words), plus two alternative hooks.",
  ].join("\n");
}
