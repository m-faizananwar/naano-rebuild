// Pulls the title, meta description and h1/h2 texts out of raw HTML with
// regexes — no DOM, no dependency. Good enough for a company home page; the
// AI (or the template) writes the profile from this.
import { SITE_DESCRIPTION_MAX_CHARS, SITE_HEADING_MAX_CHARS, SITE_HEADINGS_MAX, SITE_TITLE_MAX_CHARS } from "../constants";

export type HtmlSummary = { title: string; description: string; headings: string[] };

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘",
  rdquo: "”", ldquo: "“", copy: "©", reg: "®", trade: "™",
};
const HEX_RADIX = 16;

export function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, HEX_RADIX)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

// Tags out, entities decoded, whitespace collapsed.
export function cleanText(html: string, max: number): string {
  const text = decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

function stripNonContent(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
}

// <meta name="description" content="…"> or property="og:description", in any attribute order.
function metaContent(html: string, key: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const keyMatch = /\b(?:name|property)\s*=\s*["']?([^"'\s>]+)/i.exec(tag);
    if (!keyMatch || keyMatch[1].toLowerCase() !== key) continue;
    const content = /\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
    const value = content?.[1] ?? content?.[2] ?? content?.[3];
    if (value?.trim()) return value;
  }
  return null;
}

function headings(html: string): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/<h([12])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = cleanText(match[2], SITE_HEADING_MAX_CHARS);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    found.push(text);
    if (found.length >= SITE_HEADINGS_MAX) break;
  }
  return found;
}

export function summarizeHtml(rawHtml: string): HtmlSummary {
  const html = stripNonContent(rawHtml);
  const titleTag = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? metaContent(html, "og:title") ?? "";
  const description = metaContent(html, "description") ?? metaContent(html, "og:description") ?? "";
  return {
    title: cleanText(titleTag, SITE_TITLE_MAX_CHARS),
    description: cleanText(description, SITE_DESCRIPTION_MAX_CHARS),
    headings: headings(html),
  };
}
