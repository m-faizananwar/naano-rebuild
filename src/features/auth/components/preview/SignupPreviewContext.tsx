"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

export type SignupPreview = { firstName: string; lastName: string; email: string };
type Ctx = { values: SignupPreview; publish: (next: SignupPreview) => void };

const EMPTY: SignupPreview = { firstName: "", lastName: "", email: "" };
const SignupPreviewCtx = createContext<Ctx | null>(null);

// The creator sign-up form and the live card sit in different columns; this
// carries what the person types across so the card updates as they go.
export function SignupPreviewProvider({ children }: { children: ReactNode }) {
  const [values, publish] = useState<SignupPreview>(EMPTY);
  const ctx = useMemo(() => ({ values, publish }), [values]);
  return <SignupPreviewCtx.Provider value={ctx}>{children}</SignupPreviewCtx.Provider>;
}

// null outside the provider (login, brand sign-up): the form then publishes nothing.
export const useSignupPreview = () => useContext(SignupPreviewCtx);
