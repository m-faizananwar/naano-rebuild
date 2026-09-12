import type { Metadata } from "next";
import { BookCallPage } from "@/features/public/components/pages/BookCallPage";

export const metadata: Metadata = { title: "Book a strategy call · naano", description: "30 minutes to map creator angles, campaign format and budget for your ICP." };

export default function Page() {
  return <BookCallPage />;
}
