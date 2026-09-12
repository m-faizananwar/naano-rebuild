import type { Metadata } from "next";
import { PricingPage } from "@/features/public/components/pages/PricingPage";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Pricing · ${BRAND.wordmark}`, description: "Self-serve at €0 per month, pay per published post from €20. Managed campaigns at €700 per month plus post spend." };

export default function Page() {
  return <PricingPage />;
}
