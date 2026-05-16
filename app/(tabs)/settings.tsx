import { useCallback, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { DataActions } from "@/components/DataActions";
import { ItemManager } from "@/components/ItemManager";
import { NotificationSetting } from "@/components/NotificationSetting";
import { Section } from "@/components/Section";
import { refresh, useAppData } from "@/data/store";

export default function SettingsScreen() {
  const { data } = useAppData();

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, []),
  );

  const items = useMemo(
    () => [...data.items].sort((a, b) => a.order - b.order),
    [data.items],
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950" edges={["top"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View className="px-5 pb-2 pt-6">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            설정
          </Text>
          <Text className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            나의 영성훈련
          </Text>
        </View>

        <Section
          title="훈련 항목"
          hint="항목을 탭하면 이름을 수정할 수 있습니다. ▲▼로 순서 변경."
        >
          <ItemManager items={items} />
        </Section>

        <Section
          title="알림"
          hint="정한 시각에 한 번 매일 반복. iOS는 development build에서 동작합니다."
        >
          <NotificationSetting value={data.settings.notification} />
        </Section>

        <Section title="데이터">
          <DataActions />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
