import type { Metadata } from "next";
import { BenchmarksPage } from "@/features/public/components/pages/BenchmarksPage";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `B2B Creator-Led Growth Benchmarks: Q2 2026 · ${BRAND.wordmark}`, description: `First-party CPL, CTR and conversion data from 312 campaigns on ${BRAND.name}.` };

export default function Page() {
  return <BenchmarksPage />;
}
