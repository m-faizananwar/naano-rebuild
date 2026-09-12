import { Globe } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { BRAND } from "@/config/brand";
import { AuthMediaPanel } from "./media/AuthMediaPanel";

type Props = {
  children: ReactNode;
  // Brand onboarding still passes its flat blue panel copy; the auth pages
  // pass nothing and get the media card panel.
  panelTitle?: string;
  panelBody?: string;
  panelFootnote?: string;
};

function BrandPanel({ panelTitle, panelBody, panelFootnote }: Pick<Props, "panelTitle" | "panelBody" | "panelFootnote">) {
  return (
    <aside className="hidden flex-col justify-center bg-brand px-16 text-brand-foreground lg:flex xl:px-24">
      <h2 className="text-4xl font-bold tracking-tight">{panelTitle}</h2>
      <p className="mt-5 max-w-md text-lg/relaxed opacity-90">{panelBody}</p>
      {panelFootnote ? <p className="mt-8 text-sm opacity-75">{panelFootnote}</p> : null}
    </aside>
  );
}

// Register/login layout: white form column left (Inter, our forms untouched),
// the media card panel right from lg up. Below lg the panel is hidden and the
// page is the form only, on white. The form column's direct children fade up
// with --d 9 onwards in DOM order (auth-media.css, .auth-stagger).
export function AuthSplitLayout({ children, ...panel }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-24 xl:px-32">
        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="w-full max-w-md">
            <div className="anim flex items-center justify-between" style={{ "--d": 9 } as React.CSSProperties}>
              <Link href="/" aria-label={`${BRAND.wordmark} home`} className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
                <BrandWordmark />
              </Link>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80">
                <Globe className="size-3.5" aria-hidden="true" />
                EN
              </span>
            </div>
            <div className="auth-stagger mt-10">{children}</div>
          </div>
        </div>
      </div>
      {panel.panelTitle ? <BrandPanel {...panel} /> : <AuthMediaPanel />}
    </div>
  );
}
