// Date formatting for the brand app: "12 Sept 2026" like naano's cards.
const DAY_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const SHORT_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const DAY_MS = 86_400_000;

export function formatDay(iso: string | null | undefined): string {
  if (!iso) return "—";
  return DAY_FORMAT.format(new Date(iso));
}

export function formatShortDay(iso: string): string {
  return SHORT_FORMAT.format(new Date(iso));
}

// yyyy-mm-dd for <input type="date">, in UTC.
export function toDateInputValue(iso: string | null | undefined): string {
  return iso ? iso.slice(0, "yyyy-mm-dd".length) : "";
}

export function daysUntil(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - now) / DAY_MS);
}
