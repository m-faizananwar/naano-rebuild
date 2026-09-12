import Link from "next/link";
import { NaanoWordmark } from "@/components/NaanoWordmark";
import { AgencyModeToggle } from "./AgencyModeToggle";
import { navFor } from "./nav";
import { SidebarNav } from "./SidebarNav";
import { SignOutButton } from "./SignOutButton";
import type { ShellViewer } from "./viewer";

const NAV_LINK_CLASS =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

export function Sidebar({ viewer, onNavigate }: { viewer: ShellViewer; onNavigate?: () => void }) {
  const root = `/${viewer.role}`;
  const nav = navFor(viewer.role);
  return (
    <nav aria-label="Main" className="flex h-full flex-col gap-6 px-3 py-5">
      <Link href={root} className="px-3" aria-label="Overview">
        <NaanoWordmark />
      </Link>
      {viewer.role === "brand" ? (
        <div className="side-chrome">
          <AgencyModeToggle />
        </div>
      ) : null}
      <SidebarNav role={viewer.role} section="primary" onNavigate={onNavigate} />
      {nav.secondary.length > 0 ? (
        <div className="mt-auto border-t pt-4">
          <SidebarNav role={viewer.role} section="secondary" onNavigate={onNavigate} />
          <div className="mt-0.5">
            {viewer.preview ? null : <SignOutButton csrfToken={viewer.csrfToken} className={NAV_LINK_CLASS} />}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
