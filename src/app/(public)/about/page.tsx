import type { Metadata } from "next";
import { AboutPage } from "@/features/public/components/pages/AboutPage";

export const metadata: Metadata = { title: "About · naano", description: "Paris-based, founded 2025. Built by founders, for founders." };

export default function Page() {
  return <AboutPage />;
}
