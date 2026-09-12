import type { Metadata } from "next";
import { BookCallPage } from "@/features/public/components/pages/BookCallPage";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Book a strategy call · ${BRAND.wordmark}`, description: "30 minutes to map creator angles, campaign format and budget for your ICP." };

export default function Page() {
  return <BookCallPage />;
}
