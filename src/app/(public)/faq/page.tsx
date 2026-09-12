import type { Metadata } from "next";
import { FaqPage } from "@/features/public/components/pages/FaqPage";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `FAQ · ${BRAND.wordmark}`, description: `Everything companies and creators ask before getting started on ${BRAND.name}.` };

export default function Page() {
  return <FaqPage />;
}
