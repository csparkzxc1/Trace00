import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AppData,
  ChecklistItem,
  DEFAULT_DATA,
  DEFAULT_ITEMS,
  DayRecord,
  NotificationSettings,
  STORAGE_KEY,
} from "./types";
import { uid } from "@/lib/id";

function emptyRecord(): DayRecord {
  return { checks: {}, memo: "" };
}

export async function loadData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded: AppData = {
      ...DEFAULT_DATA,
      items: DEFAULT_ITEMS.map((it, i) => ({
        id: uid(),
        name: it.name,
        order: i,
      })),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      items: parsed.items ?? [],
      records: parsed.records ?? {},
      settings: parsed.settings ?? DEFAULT_DATA.settings,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function addItem(name: string): Promise<AppData> {
  const data = await loadData();
  const order = data.items.length;
  data.items.push({ id: uid(), name: name.trim(), order });
  await saveData(data);
  return data;
}

export async function updateItem(
  id: string,
  patch: Partial<Omit<ChecklistItem, "id">>,
): Promise<AppData> {
  const data = await loadData();
  data.items = data.items.map((it) =>
    it.id === id ? { ...it, ...patch } : it,
  );
  await saveData(data);
  return data;
}

export async function deleteItem(id: string): Promise<AppData> {
  const data = await loadData();
  data.items = data.items
    .filter((it) => it.id !== id)
    .map((it, i) => ({ ...it, order: i }));
  for (const key of Object.keys(data.records)) {
    const rec = data.records[key];
    if (rec && rec.checks[id] !== undefined) {
      const next: DayRecord = {
        checks: { ...rec.checks },
        memo: rec.memo,
      };
      delete next.checks[id];
      data.records[key] = next;
    }
  }
  await saveData(data);
  return data;
}

export async function reorderItems(orderedIds: string[]): Promise<AppData> {
  const data = await loadData();
  const map = new Map(data.items.map((it) => [it.id, it]));
  data.items = orderedIds
    .map((id, i) => {
      const item = map.get(id);
      return item ? { ...item, order: i } : null;
    })
    .filter((x): x is ChecklistItem => x !== null);
  await saveData(data);
  return data;
}

export async function setCheck(
  dateKey: string,
  itemId: string,
  checked: boolean,
): Promise<AppData> {
  const data = await loadData();
  const rec = data.records[dateKey] ?? emptyRecord();
  const checks = { ...rec.checks };
  if (checked) {
    checks[itemId] = true;
  } else {
    delete checks[itemId];
  }
  data.records[dateKey] = { ...rec, checks };
  await saveData(data);
  return data;
}

export async function setMemo(
  dateKey: string,
  memo: string,
): Promise<AppData> {
  const data = await loadData();
  const rec = data.records[dateKey] ?? emptyRecord();
  data.records[dateKey] = { ...rec, memo };
  await saveData(data);
  return data;
}

export async function setNotificationSettings(
  settings: NotificationSettings,
): Promise<AppData> {
  const data = await loadData();
  data.settings.notification = settings;
  await saveData(data);
  return data;
}

export async function replaceAll(next: AppData): Promise<AppData> {
  const sanitized: AppData = {
    items: Array.isArray(next.items)
      ? next.items
          .filter((it) => it && typeof it.id === "string" && typeof it.name === "string")
          .map((it, i) => ({ id: it.id, name: it.name, order: i }))
      : [],
    records: typeof next.records === "object" && next.records ? next.records : {},
    settings: {
      notification: {
        enabled: !!next.settings?.notification?.enabled,
        hour: clampInt(next.settings?.notification?.hour, 0, 23, 6),
        minute: clampInt(next.settings?.notification?.minute, 0, 59, 30),
      },
    },
  };
  await saveData(sanitized);
  return sanitized;
}

export async function resetAll(): Promise<AppData> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return loadData();
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return fallback;
  const n = Math.floor(v);
  if (n < min) return min;
  if (n > max) return max;
  return n;
}
