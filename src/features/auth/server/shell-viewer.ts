import "server-only";
import { redirect } from "next/navigation";
import { isDbConfigured } from "@/db";
import type { ShellViewer } from "@/components/shell/viewer";
import { ROLE_HOME } from "../constants";
import type { Role } from "../schemas";
import { getViewer, type Viewer } from "./session";

const PREVIEW: Record<Role, ShellViewer> = {
  brand: { role: "brand", firstName: "Demo", lastName: "Brand", workspace: "Preview workspace", avatarUrl: null, walletCents: 0, csrfToken: "", preview: true },
  creator: { role: "creator", firstName: "Demo", lastName: "Creator", workspace: "Preview workspace", avatarUrl: null, walletCents: 0, csrfToken: "", preview: true },
};

export function toShellViewer(viewer: Viewer): ShellViewer {
  return {
    role: viewer.role,
    firstName: viewer.firstName,
    lastName: viewer.lastName,
    workspace: viewer.brand?.company ?? (viewer.creator ? `@${viewer.creator.handle}` : viewer.email),
    avatarUrl: viewer.creator?.avatarUrl ?? null,
    walletCents: viewer.brand?.walletCents ?? viewer.creator?.availableCents ?? 0,
    csrfToken: viewer.csrfToken,
    preview: false,
  };
}

// Used by the /brand and /creator layouts. Redirects when the session is
// missing or belongs to the other role; returns a preview viewer when there
// is no database so the shells stay browsable.
export async function resolveShellViewer(role: Role, pathname: string) {
  if (!isDbConfigured()) return { mode: "unconfigured" as const, shell: PREVIEW[role] };
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(pathname)}`);
  if (viewer.role !== role) redirect(ROLE_HOME[viewer.role]);
  return { mode: "ok" as const, shell: toShellViewer(viewer), viewer };
}
