// The fake slot grid: the next N weekdays × a fixed set of times. Pure, so
// the picker can render it on the client without a calendar provider.
export type CallDay = { iso: string; label: string; times: string[] };

export const SLOT_TIMES = ["10:00", "11:30", "14:30", "16:00"] as const;
const WEEKDAYS = 5;
const SATURDAY = 6;
const SUNDAY = 0;

export function nextWeekdaySlots(from: Date, count = WEEKDAYS): CallDay[] {
  const days: CallDay[] = [];
  const cursor = new Date(from);
  cursor.setDate(cursor.getDate() + 1);
  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== SATURDAY && dow !== SUNDAY) {
      days.push({
        iso: cursor.toISOString().slice(0, "YYYY-MM-DD".length),
        label: cursor.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        times: [...SLOT_TIMES],
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
