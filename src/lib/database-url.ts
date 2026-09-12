// Where the Postgres URL comes from. Vercel's Neon integration writes its
// variables with a project prefix (naano_clone_DATABASE_URL, …), so the app
// accepts the plain name first and the prefixed/alternate names after it.
// Pure: takes the env object explicitly, so it is safe from the proxy (edge), the
// db client and drizzle-kit alike.
export const DATABASE_URL_NAMES = ["DATABASE_URL", "naano_clone_DATABASE_URL", "POSTGRES_URL", "naano_clone_POSTGRES_URL"] as const;
export type DatabaseUrlName = (typeof DATABASE_URL_NAMES)[number];

export function resolveDatabaseUrl(env: Record<string, string | undefined>): { name: DatabaseUrlName; url: string } | null {
  for (const name of DATABASE_URL_NAMES) {
    const url = env[name];
    if (url) return { name, url };
  }
  return null;
}
