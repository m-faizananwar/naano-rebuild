import type { Metadata } from "next";
import { FaqPage } from "@/features/public/components/pages/FaqPage";

export const metadata: Metadata = { title: "FAQ · naano", description: "Everything companies and creators ask before getting started on Naano." };

export default function Page() {
  return <FaqPage />;
}
