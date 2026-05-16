import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { Checkbox } from "@/components/Checkbox";
import { setCheck, setMemo } from "@/data/storage";
import { refresh, setStore, useAppData } from "@/data/store";
import { formatKorean, todayKey } from "@/lib/date";

export default function TodayScreen() {
  const { data, loaded } = useAppData();
  const [today, setToday] = useState(() => todayKey());
  const [displayDate, setDisplayDate] = useState(() => formatKorean(new Date()));
  const [memoDraft, setMemoDraft] = useState("");

  const recompute = useCallback(() => {
    const now = new Date();
    setToday(todayKey(now));
    setDisplayDate(formatKorean(now));
  }, []);

  useFocusEffect(
    useCallback(() => {
      recompute();
      refresh().catch(() => {});
    }, [recompute]),
  );

  useEffect(() => {
    const record = data.records[today];
    setMemoDraft(record?.memo ?? "");
  }, [today, data.records]);

  const items = useMemo(
    () => [...data.items].sort((a, b) => a.order - b.order),
    [data.items],
  );

  const todayRecord = data.records[today];
  const completedCount = items.filter((it) => todayRecord?.checks[it.id]).length;
  const total = items.length;

  const onToggle = async (itemId: string) => {
    const wasChecked = !!todayRecord?.checks[itemId];
    const next = await setCheck(today, itemId, !wasChecked);
    setStore(next);
  };

  const onChangeMemo = (text: string) => {
    setMemoDraft(text);
  };

  const onBlurMemo = async () => {
    const next = await setMemo(today, memoDraft);
    setStore(next);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-neutral-950"
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="px-5 pb-2 pt-6">
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              오늘
            </Text>
            <Text className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {displayDate}
            </Text>
            <Text className="mt-2 text-sm text-sage-500">
              {loaded ? `${completedCount} / ${total} 완료` : " "}
            </Text>
          </View>

          <View className="mt-2">
            {items.length === 0 && loaded ? (
              <View className="mx-5 my-6 rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
                <Text className="text-center text-neutral-500">
                  설정 탭에서 훈련 항목을 추가해 주세요.
                </Text>
              </View>
            ) : (
              items.map((it) => (
                <Checkbox
                  key={it.id}
                  checked={!!todayRecord?.checks[it.id]}
                  label={it.name}
                  onToggle={() => onToggle(it.id)}
                />
              ))
            )}
          </View>

          <View className="mx-4 mt-6 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
            <Text className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              묵상 · 감사 한 줄
            </Text>
            <TextInput
              value={memoDraft}
              onChangeText={onChangeMemo}
              onBlur={onBlurMemo}
              multiline
              placeholder="오늘 마음에 새긴 한 줄..."
              placeholderTextColor="#9ca3af"
              style={{ minHeight: 60 }}
              className="text-base text-neutral-900 dark:text-neutral-100"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
