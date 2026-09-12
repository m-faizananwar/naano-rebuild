import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { LegalPage } from "@/features/public/components/pages/LegalPage";
import { PRIVACY_DOC } from "@/features/public/legal-copy";

export const metadata: Metadata = { title: `Privacy Notice · ${BRAND.wordmark}`, description: PRIVACY_DOC.sub };

export default function Page() {
  return <LegalPage doc={PRIVACY_DOC} />;
}
