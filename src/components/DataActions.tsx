import { useState } from "react";
import { Alert, Pressable, Share, Text, TextInput, View } from "react-native";

import { loadData, replaceAll, resetAll } from "@/data/storage";
import { setStore } from "@/data/store";
import { AppData } from "@/data/types";
import {
  applyNotificationSchedule,
  cancelAllScheduled,
} from "@/lib/notifications";

type ImportMode = "idle" | "open";

function isAppDataShape(v: unknown): v is AppData {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    Array.isArray(o.items) &&
    typeof o.records === "object" &&
    o.records !== null
  );
}

export function DataActions() {
  const [mode, setMode] = useState<ImportMode>("idle");
  const [draft, setDraft] = useState("");

  const onExport = async () => {
    const data = await loadData();
    const json = JSON.stringify(data, null, 2);
    try {
      await Share.share({ message: json });
    } catch (e) {
      Alert.alert("내보내기 실패", String(e));
    }
  };

  const onImport = async () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(draft);
    } catch {
      Alert.alert("가져오기 실패", "올바른 JSON이 아닙니다.");
      return;
    }
    if (!isAppDataShape(parsed)) {
      Alert.alert("가져오기 실패", "데이터 형식이 맞지 않습니다.");
      return;
    }
    Alert.alert(
      "데이터 덮어쓰기",
      "현재 데이터가 가져온 데이터로 대체됩니다. 계속할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "덮어쓰기",
          style: "destructive",
          onPress: async () => {
            const next = await replaceAll(parsed as AppData);
            setStore(next);
            try {
              await applyNotificationSchedule(next.settings.notification);
            } catch {}
            setMode("idle");
            setDraft("");
            Alert.alert("완료", "데이터를 가져왔습니다.");
          },
        },
      ],
    );
  };

  const onReset = () => {
    Alert.alert(
      "전체 초기화",
      "모든 체크, 메모, 항목, 설정이 삭제됩니다. 정말 초기화할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "초기화",
          style: "destructive",
          onPress: async () => {
            const next = await resetAll();
            setStore(next);
            try {
              await cancelAllScheduled();
            } catch {}
            Alert.alert("완료", "초기화되었습니다.");
          },
        },
      ],
    );
  };

  return (
    <View className="mx-4">
      <View className="overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900">
        <Pressable onPress={onExport} className="px-4 py-3 active:opacity-60">
          <Text className="text-base text-neutral-900 dark:text-neutral-100">
            JSON 내보내기
          </Text>
        </Pressable>
        <View className="h-px bg-neutral-200 dark:bg-neutral-800" />
        <Pressable
          onPress={() => setMode(mode === "open" ? "idle" : "open")}
          className="px-4 py-3 active:opacity-60"
        >
          <Text className="text-base text-neutral-900 dark:text-neutral-100">
            JSON 가져오기
          </Text>
        </Pressable>
        <View className="h-px bg-neutral-200 dark:bg-neutral-800" />
        <Pressable onPress={onReset} className="px-4 py-3 active:opacity-60">
          <Text className="text-base text-rose-500">전체 데이터 초기화</Text>
        </Pressable>
      </View>

      {mode === "open" ? (
        <View className="mt-3 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            placeholder="여기에 JSON 붙여넣기"
            placeholderTextColor="#9ca3af"
            style={{ minHeight: 120, textAlignVertical: "top" }}
            className="rounded-lg bg-white p-3 text-sm text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          />
          <View className="mt-2 flex-row justify-end">
            <Pressable
              onPress={() => {
                setMode("idle");
                setDraft("");
              }}
              className="rounded-xl px-4 py-2"
            >
              <Text className="text-base text-neutral-500">취소</Text>
            </Pressable>
            <Pressable
              onPress={onImport}
              disabled={!draft.trim()}
              className={
                "ml-2 rounded-xl px-4 py-2 " +
                (draft.trim() ? "bg-sage-500" : "bg-neutral-300 dark:bg-neutral-700")
              }
            >
              <Text className="font-semibold text-white">가져오기</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
