import type { Metadata } from "next";
import { CaseStudyPage } from "@/features/public/components/pages/CaseStudyPage";

export const metadata: Metadata = { title: "BlogSEO case study · naano", description: "How BlogSEO turned creator marketing into a measurable acquisition channel." };

export default function Page() {
  return <CaseStudyPage />;
}
