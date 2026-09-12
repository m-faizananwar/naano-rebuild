import type { Metadata } from "next";
import { AboutPage } from "@/features/public/components/pages/AboutPage";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `About · ${BRAND.wordmark}`, description: "Paris-based, founded 2025. Built by founders, for founders." };

export default function Page() {
  return <AboutPage />;
}
