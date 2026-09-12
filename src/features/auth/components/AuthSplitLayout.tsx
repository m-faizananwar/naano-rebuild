import Link from "next/link";
import type { ReactNode } from "react";
import { NaanoWordmark } from "@/components/NaanoWordmark";

type Props = {
  children: ReactNode;
  panelTitle: string;
  panelBody: string;
  panelFootnote?: string;
};

// naano's register/login layout: white form column left, blue panel right.
export function AuthSplitLayout({ children, panelTitle, panelBody, panelFootnote }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="naano home">
            <NaanoWordmark />
          </Link>
          <span className="text-xs font-medium text-muted-foreground">EN</span>
        </div>
        <div className="flex flex-1 items-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <aside className="hidden flex-col justify-center bg-brand px-16 text-brand-foreground lg:flex">
        <h2 className="text-4xl font-semibold tracking-tight">{panelTitle}</h2>
        <p className="mt-4 max-w-md text-lg/relaxed opacity-90">{panelBody}</p>
        {panelFootnote ? <p className="mt-6 text-sm opacity-75">{panelFootnote}</p> : null}
      </aside>
    </div>
  );
}
