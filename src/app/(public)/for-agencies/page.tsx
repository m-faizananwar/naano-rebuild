import type { Metadata } from "next";
import { ForAgenciesPage } from "@/features/public/components/pages/ForAgenciesPage";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `${BRAND.name} for agencies`, description: "Choose the workspace that matches your agency: brand agency or creator agency." };

export default function Page() {
  return <ForAgenciesPage />;
}
