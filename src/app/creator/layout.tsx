import type { ReactNode } from "react";
import { DatabaseNotConfigured } from "@/components/page/DatabaseNotConfigured";
import { AppShell } from "@/components/shell/AppShell";
import { resolveShellViewer } from "@/features/auth/server/shell-viewer";

export default async function CreatorLayout({ children }: { children: ReactNode }) {
  const resolved = await resolveShellViewer("creator", "/creator");
  return (
    <AppShell viewer={resolved.shell}>{resolved.mode === "ok" ? children : <DatabaseNotConfigured />}</AppShell>
  );
}
