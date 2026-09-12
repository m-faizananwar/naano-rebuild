import type { Metadata } from "next";
import { PageHeader } from "@/components/page/PageHeader";
import { BookACallView } from "@/features/workspace/components/book-a-call/BookACallView";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Book a call · ${BRAND.wordmark}` };

// Demo slot picker; nothing is written and no calendar provider is embedded.
export default function BrandBookACallPage() {
  return (
    <>
      <PageHeader title={`Launch free with the ${BRAND.name} team`} description={`Need an expert eye? Book a free call. 15 minutes with a ${BRAND.name} expert to plan your next campaign.`} />
      <BookACallView />
    </>
  );
}
