export type ChecklistItem = {
  id: string;
  name: string;
  order: number;
};

export type DayRecord = {
  checks: Record<string, boolean>;
  memo: string;
};

export type NotificationSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
};

export type AppData = {
  items: ChecklistItem[];
  records: Record<string, DayRecord>;
  settings: {
    notification: NotificationSettings;
  };
};

export const STORAGE_KEY = "checklist:v1";

export const DEFAULT_ITEMS: { name: string }[] = [
  { name: "QT(말씀묵상)" },
  { name: "기도" },
  { name: "말씀암송" },
  { name: "감사일기" },
  { name: "주일예배" },
];

export const DEFAULT_DATA: AppData = {
  items: [],
  records: {},
  settings: {
    notification: { enabled: false, hour: 6, minute: 30 },
  },
};
