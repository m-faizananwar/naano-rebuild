"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "../../server/actions";

// The spec's .subscribe form (label, input, arrow button) with a submit that
// writes a newsletter row and swaps to a small thanks. No email is sent.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ done: string | null; error: string | null }>({ done: null, error: null });
  const [pending, startTransition] = useTransition();

  if (state.done) return <p className="subscribe-thanks" role="status">Thanks — we&rsquo;ll write to {state.done}. Nothing sent yet in this build.</p>;

  return (
    <>
    <form
      className="subscribe"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await subscribeNewsletter({ email });
          setState(result.ok ? { done: result.data.email, error: null } : { done: null, error: result.error });
        });
      }}
    >
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input id="nl-email" type="email" name="email" placeholder="Leave your email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={pending} aria-describedby={state.error ? "nl-error" : undefined} />
      <button type="submit" aria-label="Subscribe" disabled={pending}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
      </button>
    </form>
    {state.error ? <p id="nl-error" className="subscribe-error" role="alert">{state.error}</p> : null}
    </>
  );
}
