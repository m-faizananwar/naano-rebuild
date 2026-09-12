import type { Metadata } from "next";
import { BenchmarksPage } from "@/features/public/components/pages/BenchmarksPage";

export const metadata: Metadata = { title: "B2B Creator-Led Growth Benchmarks: Q2 2026 · naano", description: "First-party CPL, CTR and conversion data from 312 campaigns on Naano." };

export default function Page() {
  return <BenchmarksPage />;
}
