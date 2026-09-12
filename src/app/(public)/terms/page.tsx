import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { LegalPage } from "@/features/public/components/pages/LegalPage";
import { TERMS_DOC } from "@/features/public/legal-copy";

export const metadata: Metadata = { title: `Terms & Policies · ${BRAND.wordmark}`, description: TERMS_DOC.sub };

export default function Page() {
  return <LegalPage doc={TERMS_DOC} />;
}
