import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { ShellViewer } from "./viewer";

export function AppShell({ viewer, children }: { viewer: ShellViewer; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background lg:block">
        <Sidebar viewer={viewer} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar viewer={viewer} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {/* Grid/flex items default to min-width:auto, which lets a wide table stretch the page; wide content must scroll inside its own container. */}
          <div className="mx-auto w-full min-w-0 max-w-6xl [&_.grid>*]:min-w-0 [&_.flex>*]:min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
