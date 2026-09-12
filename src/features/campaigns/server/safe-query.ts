import "server-only";

export type QueryResult<T> = { ok: true; data: T } | { ok: false };

// Pages render an ErrorState instead of a 500 when a read fails. The error is
// logged here with context; the page only learns that it failed.
export async function safeQuery<T>(label: string, context: Record<string, unknown>, read: () => Promise<T>): Promise<QueryResult<T>> {
  try {
    return { ok: true, data: await read() };
  } catch (error) {
    console.error(`[campaigns] ${label} failed`, { ...context, error });
    return { ok: false };
  }
}
