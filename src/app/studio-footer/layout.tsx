import type { Metadata } from "next";
import type { ReactNode } from "react";

// docs/reference/gaze-footer-spec.md, app/layout.tsx: its own title, description
// and favicon (the Logoipsum logo lives at /studio-footer/logo.svg because
// /logo.svg is the product mark).
export const metadata: Metadata = {
  title: "Studio — Footer",
  description: "Fresh ideas, imagination, and creative collaboration.",
  icons: { icon: "/studio-footer/logo.svg" },
};

export default function StudioFooterLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
