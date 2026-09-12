import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RoleChoiceCards } from "@/features/auth/components/RoleChoiceCards";

export const metadata: Metadata = { title: "Create your account · naano" };

export default function RegisterPage() {
  return (
    <AuthSplitLayout panelTitle="One platform. Two sides." panelBody="Creators. Brands. Results.">
      <RoleChoiceCards />
    </AuthSplitLayout>
  );
}
