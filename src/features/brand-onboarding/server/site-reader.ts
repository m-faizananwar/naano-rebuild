import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { SITE_FETCH_MAX_BYTES, SITE_FETCH_MAX_REDIRECTS, SITE_FETCH_TIMEOUT_MS, SITE_FETCH_USER_AGENT } from "../constants";
import type { WebsiteSummaryDto } from "../schemas";
import { summarizeHtml } from "./html-summary";

export type SiteReadResult = { ok: true; summary: WebsiteSummaryDto } | { ok: false; reason: string };

const HTTP_REDIRECT_MIN = 300;
const HTTP_REDIRECT_MAX = 399;
const HTTP_OK_MAX = 299;

// Private / loopback / link-local ranges: the reader must never be pointed at
// the database, the metadata service or anything else on the inside.
function isPrivateIpv4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  const LOOPBACK = 127;
  const CLASS_A_PRIVATE = 10;
  const CLASS_B_PRIVATE = 172;
  const CLASS_B_LOW = 16;
  const CLASS_B_HIGH = 31;
  const CLASS_C_PRIVATE = 192;
  const CLASS_C_SECOND = 168;
  const LINK_LOCAL = 169;
  const LINK_LOCAL_SECOND = 254;
  const CGNAT = 100;
  const CGNAT_LOW = 64;
  const CGNAT_HIGH = 127;
  if (a === 0 || a === LOOPBACK || a === CLASS_A_PRIVATE) return true;
  if (a === CLASS_B_PRIVATE && b >= CLASS_B_LOW && b <= CLASS_B_HIGH) return true;
  if (a === CLASS_C_PRIVATE && b === CLASS_C_SECOND) return true;
  if (a === LINK_LOCAL && b === LINK_LOCAL_SECOND) return true;
  if (a === CGNAT && b >= CGNAT_LOW && b <= CGNAT_HIGH) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80")) return true;
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower);
  return mapped ? isPrivateIpv4(mapped[1]) : false;
}

const IPV4 = 4;
const IPV6 = 6;

function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip);
  if (version === IPV4) return isPrivateIpv4(ip);
  if (version === IPV6) return isPrivateIpv6(ip);
  return true;
}

// Returns the reason the URL is refused, or null when it is safe to fetch.
async function refusalFor(url: URL): Promise<string | null> {
  if (url.protocol !== "http:" && url.protocol !== "https:") return "only http and https addresses are read";
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return "internal host";
  if (isIP(host)) return isPrivateAddress(host) ? "private address" : null;
  try {
    const addresses = await lookup(host, { all: true });
    if (addresses.length === 0) return "host not found";
    return addresses.some((entry) => isPrivateAddress(entry.address)) ? "host resolves to a private address" : null;
  } catch {
    return "host not found";
  }
}

async function readBody(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return await response.text();
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (received < SITE_FETCH_MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    received += value.byteLength;
  }
  await reader.cancel().catch(() => undefined);
  return new TextDecoder("utf-8", { fatal: false }).decode(Buffer.concat(chunks).subarray(0, SITE_FETCH_MAX_BYTES));
}

// Redirects are followed by hand so every hop goes through the same guard.
async function fetchFollowing(start: URL, signal: AbortSignal): Promise<{ response: Response; finalUrl: URL } | { reason: string }> {
  let url = start;
  for (let hop = 0; hop <= SITE_FETCH_MAX_REDIRECTS; hop += 1) {
    const refusal = await refusalFor(url);
    if (refusal) return { reason: refusal };
    const response = await fetch(url, {
      signal,
      redirect: "manual",
      headers: { "user-agent": SITE_FETCH_USER_AGENT, accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5" },
    });
    const location = response.headers.get("location");
    if (response.status >= HTTP_REDIRECT_MIN && response.status <= HTTP_REDIRECT_MAX && location) {
      await response.body?.cancel().catch(() => undefined);
      url = new URL(location, url);
      continue;
    }
    return { response, finalUrl: url };
  }
  return { reason: "too many redirects" };
}

// Never throws: a bad URL, a slow host or a private address all come back as
// { ok: false, reason } and the caller falls back to the template.
export async function readWebsite(rawUrl: string): Promise<SiteReadResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "invalid url" };
  }
  try {
    const result = await fetchFollowing(url, AbortSignal.timeout(SITE_FETCH_TIMEOUT_MS));
    if ("reason" in result) return { ok: false, reason: result.reason };
    const { response } = result;
    if (response.status > HTTP_OK_MAX) {
      await response.body?.cancel().catch(() => undefined);
      return { ok: false, reason: `http ${response.status}` };
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !/html|xml|text\/plain/i.test(contentType)) {
      await response.body?.cancel().catch(() => undefined);
      return { ok: false, reason: `not html (${contentType})` };
    }
    const summary = summarizeHtml(await readBody(response));
    if (!summary.title && !summary.description && summary.headings.length === 0) return { ok: false, reason: "no readable text" };
    return { ok: true, summary: { ...summary, fetchedAt: new Date().toISOString() } };
  } catch (error) {
    const reason = error instanceof Error && error.name === "TimeoutError" ? "timed out" : "unreachable";
    return { ok: false, reason };
  }
}
