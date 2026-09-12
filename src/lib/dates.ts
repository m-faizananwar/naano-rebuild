// Date display helpers over ISO strings (DTOs carry ISO, never Date objects).
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";

const DAY_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const SHORT_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const DAY_MS = 86_400_000;

// "12 Sept 2026" like naano's campaign cards (UTC).
export function formatDay(iso: string | null | undefined): string {
  if (!iso) return "—";
  return DAY_FORMAT.format(new Date(iso));
}

export function formatShortDay(iso: string): string {
  return SHORT_FORMAT.format(new Date(iso));
}

export function formatDate(iso: string | null | undefined, fallback = "—"): string {
  if (!iso) return fallback;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? fallback : format(date, "d MMM yyyy");
}

export function formatDateTime(iso: string | null | undefined, fallback = "—"): string {
  if (!iso) return fallback;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? fallback : format(date, "d MMM yyyy, HH:mm");
}

// "2 hours ago", "3 days ago" — for "Updated" columns and thread previews.
export function timeAgo(iso: string | null | undefined, fallback = "—"): string {
  if (!iso) return fallback;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? fallback : `${formatDistanceToNowStrict(date)} ago`;
}

// Chat-style stamp: time today, "Yesterday", otherwise the date.
export function messageStamp(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "d MMM");
}

// yyyy-mm-dd for <input type="date">: a Date formats in local time, an ISO
// string is sliced (UTC). Empty input gives "".
export function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return format(value, "yyyy-MM-dd");
  return value.slice(0, "yyyy-mm-dd".length);
}

export function daysUntil(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - now) / DAY_MS);
}
