import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

import { AppData, DEFAULT_DATA } from "./types";
import { loadData } from "./storage";

type Listener = () => void;

let snapshot: AppData = DEFAULT_DATA;
let loaded = false;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return snapshot;
}

export function setStore(next: AppData) {
  snapshot = next;
  loaded = true;
  emit();
}

export async function refresh(): Promise<AppData> {
  const data = await loadData();
  setStore(data);
  return data;
}

export function useAppData(): {
  data: AppData;
  loaded: boolean;
  reload: () => Promise<AppData>;
} {
  const data = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!loaded) {
      refresh().catch(() => {});
    }
  }, []);

  const reload = useCallback(() => refresh(), []);

  return useMemo(() => ({ data, loaded, reload }), [data, reload]);
}
