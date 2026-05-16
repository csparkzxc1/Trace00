import {
  addDays,
  differenceInCalendarDays,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";

import { dateKey } from "./date";
import { AppData, DayRecord } from "@/data/types";

export type HeatCell = {
  date: Date;
  key: string;
  completion: number;
  hasAny: boolean;
};

export function buildHeatmap(
  data: AppData,
  weeks: number = 12,
  now: Date = new Date(),
): HeatCell[][] {
  const today = startOfDay(now);
  const startMonday = startOfWeek(subDays(today, (weeks - 1) * 7), {
    weekStartsOn: 1,
  });
  const itemCount = data.items.length;

  const cols: HeatCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(startMonday, w * 7 + d);
      const key = dateKey(date);
      const rec = data.records[key];
      const checked = rec ? Object.values(rec.checks).filter(Boolean).length : 0;
      const completion = itemCount > 0 ? checked / itemCount : 0;
      col.push({
        date,
        key,
        completion: date > today ? 0 : completion,
        hasAny: !!rec && (checked > 0 || (rec.memo?.length ?? 0) > 0),
      });
    }
    cols.push(col);
  }
  return cols;
}

export function computeStreak(
  data: AppData,
  now: Date = new Date(),
): number {
  const itemCount = data.items.length;
  if (itemCount === 0) return 0;
  let streak = 0;
  let cursor = startOfDay(now);
  while (true) {
    const key = dateKey(cursor);
    const rec = data.records[key];
    const checked = rec
      ? Object.values(rec.checks).filter(Boolean).length
      : 0;
    const done = checked >= itemCount;
    if (done) {
      streak += 1;
      cursor = subDays(cursor, 1);
      continue;
    }
    if (streak === 0 && differenceInCalendarDays(now, cursor) === 0) {
      cursor = subDays(cursor, 1);
      continue;
    }
    break;
  }
  return streak;
}

export function itemCompletionLast30Days(
  data: AppData,
  itemId: string,
  now: Date = new Date(),
): number {
  const today = startOfDay(now);
  let count = 0;
  for (let i = 0; i < 30; i++) {
    const key = dateKey(subDays(today, i));
    const rec = data.records[key];
    if (rec?.checks[itemId]) count += 1;
  }
  return count / 30;
}

export function recordSummary(rec: DayRecord | undefined, itemCount: number) {
  const checked = rec ? Object.values(rec.checks).filter(Boolean).length : 0;
  return { checked, total: itemCount, memo: rec?.memo ?? "" };
}
