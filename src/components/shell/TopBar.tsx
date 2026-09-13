import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { LaunchPlanButton } from "./topbar/LaunchPlanButton";
import { LocaleToggle } from "./topbar/LocaleToggle";
import { McpPill } from "./topbar/McpPill";
import { NotificationsButton } from "./topbar/NotificationsButton";
import { WalletChip } from "./topbar/WalletChip";
import type { ShellViewer } from "./viewer";

export function TopBar({ viewer }: { viewer: ShellViewer }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur lg:px-8">
      <MobileNav viewer={viewer} />
      <div className="nav-root ml-auto flex items-center gap-2">
        {viewer.role === "brand" ? <McpPill /> : null}
        <WalletChip role={viewer.role} walletCents={viewer.walletCents} />
        <LocaleToggle />
        {viewer.launchPlan ? <LaunchPlanButton plan={viewer.launchPlan} /> : null}
        <NotificationsButton role={viewer.role} notifications={viewer.notifications} />
        <AccountMenu viewer={viewer} />
      </div>
    </header>
  );
}
