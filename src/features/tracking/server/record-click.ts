import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/db";
import { clicks, trackingLinks } from "@/db/schema";
import { IP_HASH_SALT } from "../constants";

type ClickMeta = { ip: string | null; userAgent: string | null; referrer: string | null; country: string | null };

export type RecordClickResult = { kind: "ok"; clickId: string; destination: string } | { kind: "unknown" } | { kind: "unconfigured" };

// The redirect handler's only dependency: look the code up, insert one row.
export async function recordClick(code: string, meta: ClickMeta): Promise<RecordClickResult> {
  if (!isDbConfigured()) return { kind: "unconfigured" };
  const db = getDb();
  const [link] = await db.select().from(trackingLinks).where(eq(trackingLinks.code, code));
  if (!link) return { kind: "unknown" };
  const [click] = await db
    .insert(clicks)
    .values({
      trackingLinkId: link.id,
      ipHash: meta.ip ? createHash("sha256").update(`${IP_HASH_SALT}:${meta.ip}`).digest("hex") : null,
      userAgent: meta.userAgent,
      referrer: meta.referrer,
      country: meta.country,
    })
    .returning({ id: clicks.id });
  return { kind: "ok", clickId: click.id, destination: link.destination };
}
