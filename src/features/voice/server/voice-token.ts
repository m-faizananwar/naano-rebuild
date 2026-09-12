import "server-only";
import { createHmac } from "node:crypto";

// Shared secret Vapi echoes back in x-vapi-secret so only Vapi can call the
// webhook. Derived from the private key, which never leaves the server.
export function webhookSecret() {
  return createHmac("sha256", process.env.VAPI_PRIVATE_KEY ?? "").update("naano-vapi-webhook").digest("hex");
}
