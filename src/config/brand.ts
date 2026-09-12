// The product's own name, in one place. Every string in our UI that names the
// product reads from here; docs/ and the README keep naming naano.com as the
// reference product. Renaming = edit this file, reseed (demo emails), redeploy.
export const BRAND = {
  name: "Amplio",
  wordmark: "amplio",
  tagline: "The creators your buyers already trust.",
  // Demo logins: brand@<demoDomain> / creator@<demoDomain>, seeded by scripts/seed.
  demoDomain: "demo.amplio",
  supportEmail: "hello@amplio.example",
  // The matching copilot (naano's "Nao") and the support bot in Messages.
  copilot: "Amp",
  bot: "AmplioBot",
  // Global installed by /n.js on customer sites: window.<pixelGlobal>("event", …).
  pixelGlobal: "amplio",
  // Prefix for cookies, localStorage keys and exported file names.
  key: "amplio",
} as const;
