import { BRAND } from "@/config/brand";

export type LegalSection = { id: string; title: string; paragraphs: string[] };
export type LegalDoc = { title: string; sub: string; sections: LegalSection[] };

// Plain-language notices for a demonstration build. Not legal advice; the
// point is that the footer links land on honest pages that say what the app
// actually stores.
export const PRIVACY_DOC: LegalDoc = {
  title: "Privacy Notice",
  sub: `What ${BRAND.name} stores, why, and how to get rid of it. This is a demonstration build, so the honest answer is: not much, and nothing leaves the database.`,
  sections: [
    {
      id: "what-we-store",
      title: "What we store",
      paragraphs: [
        "Your account: email, name, a password hash and a session cookie. Your workspace: campaigns, briefs, collaborations, messages and ledger rows you create.",
        "Tracking: when someone clicks a tracked link we store a hashed IP, the user agent, the referrer and a click id; the pixel stores the events a customer site sends (sign-up, purchase) tied to that click id.",
        `Newsletter: the email you type into "The Letter" on the landing page, and nothing else. No email is sent in this build.`,
      ],
    },
    {
      id: "cookies",
      title: "Cookie Notice",
      paragraphs: [
        `${BRAND.name} sets one first-party, httpOnly session cookie when you sign in, and a first-party click cookie on tracked-link redirects so a later sign-up can be attributed. There is no advertising, analytics or third-party cookie.`,
        "The demo landing page keeps the click id and a random visitor id in localStorage, on that page only, to show the pixel working.",
      ],
    },
    {
      id: "deleting",
      title: "Deleting your data",
      paragraphs: [
        "Settings → Delete account removes your user, workspace and everything attached to it in one transaction. Demo accounts cannot be deleted because everyone shares them.",
      ],
    },
  ],
};

export const TERMS_DOC: LegalDoc = {
  title: "Terms & Policies",
  sub: `${BRAND.name} is a working rebuild made for demonstration. Using it means agreeing to a few plain things.`,
  sections: [
    {
      id: "demo",
      title: "It is a demonstration",
      paragraphs: [
        "Money in the wallet, payouts and withdrawals are ledger rows, not payments. Nothing is charged, nothing is paid out, no invoice is issued. Creators, posts and results in the demo accounts are seeded.",
        "Data may be reset at any time when the database is reseeded. Do not store anything you need to keep.",
      ],
    },
    {
      id: "conduct",
      title: "Your content",
      paragraphs: [
        "You are responsible for what you post: briefs, drafts, messages and links. Do not use the tracked links or the pixel on sites you do not control.",
      ],
    },
    {
      id: "reference",
      title: "Reference product",
      paragraphs: [
        `${BRAND.name} is shipped as a rebuild of naano.com and is not affiliated with it. Marketing figures on the public pages are the reference product's published claims, labelled as such.`,
      ],
    },
  ],
};
