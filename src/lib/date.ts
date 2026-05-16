import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function todayKey(d: Date = new Date()): string {
  return format(d, "yyyy-MM-dd");
}

export function formatKorean(d: Date = new Date()): string {
  return format(d, "yyyy.MM.dd EEEE", { locale: ko });
}

export function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function shortKorean(d: Date): string {
  return format(d, "M월 d일 (EEE)", { locale: ko });
}
