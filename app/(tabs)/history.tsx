import { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { parseISO } from "date-fns";

import { Heatmap } from "@/components/Heatmap";
import { Section } from "@/components/Section";
import { refresh, useAppData } from "@/data/store";
import { shortKorean, todayKey } from "@/lib/date";
import {
  buildHeatmap,
  computeStreak,
  itemCompletionLast30Days,
  recordSummary,
} from "@/lib/stats";

export default function HistoryScreen() {
  const { data } = useAppData();
  const [selectedKey, setSelectedKey] = useState<string>(() => todayKey());

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
      setSelectedKey(todayKey());
    }, []),
  );

  const items = useMemo(
    () => [...data.items].sort((a, b) => a.order - b.order),
    [data.items],
  );

  const columns = useMemo(() => buildHeatmap(data, 12), [data]);
  const streak = useMemo(() => computeStreak(data), [data]);

  const selectedRecord = data.records[selectedKey];
  const summary = recordSummary(selectedRecord, items.length);
  const selectedDate = (() => {
    try {
      return parseISO(selectedKey);
    } catch {
      return new Date();
    }
  })();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-5 pb-2 pt-6">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            기록
          </Text>
          <View className="mt-1 flex-row items-end">
            <Text className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              연속 {streak}일
            </Text>
            <Text className="ml-2 text-sm text-neutral-500">
              {streak > 0 ? "🔥 잘하고 있어요" : "오늘부터 다시 시작"}
            </Text>
          </View>
        </View>

        <Section title="최근 12주">
          <Heatmap
            columns={columns}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </Section>

        <Section title={shortKorean(selectedDate)}>
          <View className="mx-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
            <Text className="mb-2 text-sm text-neutral-500">
              {summary.checked} / {summary.total} 완료
            </Text>
            {items.length === 0 ? (
              <Text className="text-sm text-neutral-400">
                항목이 없습니다.
              </Text>
            ) : (
              items.map((it) => {
                const done = !!selectedRecord?.checks[it.id];
                return (
                  <View
                    key={it.id}
                    className="flex-row items-center py-1.5"
                  >
                    <Text
                      className={
                        "mr-2 text-base " +
                        (done ? "text-sage-500" : "text-neutral-300")
                      }
                    >
                      {done ? "✓" : "○"}
                    </Text>
                    <Text
                      className={
                        "flex-1 text-base " +
                        (done
                          ? "text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-400")
                      }
                    >
                      {it.name}
                    </Text>
                  </View>
                );
              })
            )}
            {summary.memo ? (
              <View className="mt-3 rounded-lg bg-white p-3 dark:bg-neutral-800">
                <Text className="mb-1 text-xs text-neutral-400">메모</Text>
                <Text className="text-sm text-neutral-900 dark:text-neutral-100">
                  {summary.memo}
                </Text>
              </View>
            ) : null}
          </View>
        </Section>

        <Section title="항목별 최근 30일">
          <View className="mx-4 overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900">
            {items.length === 0 ? (
              <Text className="px-4 py-3 text-sm text-neutral-400">
                항목이 없습니다.
              </Text>
            ) : (
              items.map((it, idx) => {
                const rate = itemCompletionLast30Days(data, it.id);
                const pct = Math.round(rate * 100);
                return (
                  <View key={it.id}>
                    {idx > 0 ? (
                      <View className="h-px bg-neutral-200 dark:bg-neutral-800" />
                    ) : null}
                    <View className="px-4 py-3">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base text-neutral-900 dark:text-neutral-100">
                          {it.name}
                        </Text>
                        <Text className="text-sm font-semibold text-sage-500">
                          {pct}%
                        </Text>
                      </View>
                      <View className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <View
                          style={{ width: `${pct}%` }}
                          className="h-full bg-sage-400"
                        />
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
