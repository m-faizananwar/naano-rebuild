// Date display helpers over ISO strings (DTOs carry ISO, never Date objects).
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";

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

// <input type="date"> wants YYYY-MM-DD in local time.
export function toDateInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
