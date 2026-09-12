import type { ReactNode } from "react";
import { AssistantPill } from "./assistant/AssistantPill";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { ShellViewer } from "./viewer";
import { WalletProvider } from "./WalletProvider";

export function AppShell({ viewer, children }: { viewer: ShellViewer; children: ReactNode }) {
  return (
    <WalletProvider initialCents={viewer.walletCents}>
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background lg:block">
        <Sidebar viewer={viewer} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar viewer={viewer} />
        {/* Bottom padding keeps the floating assistant pill off the last row of content on small screens. */}
        <main className="flex-1 px-4 pt-6 pb-24 lg:px-8 lg:pt-8">
          {/* Grid/flex items default to min-width:auto, which lets a wide table stretch the page; wide content must scroll inside its own container. */}
          <div className="mx-auto w-full min-w-0 max-w-6xl [&_.grid>*]:min-w-0 [&_.flex>*]:min-w-0">{children}</div>
        </main>
      </div>
      <AssistantPill role={viewer.role} workspace={viewer.workspace} />
    </div>
    </WalletProvider>
  );
}
