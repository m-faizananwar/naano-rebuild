import "server-only";
import { headers } from "next/headers";
import { TRACKED_LINK_PATH } from "../ui-constants";

// The tracked link shown to the creator is absolute (they paste it into a
// LinkedIn post), so it is built from the request's own origin.
export async function appOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? process.env.VERCEL_URL ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function trackedUrlFor(code: string | null) {
  if (!code) return null;
  return `${await appOrigin()}${TRACKED_LINK_PATH}/${code}`;
}
