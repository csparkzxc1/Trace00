import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Alert, Platform, Pressable, Switch, Text, View } from "react-native";

import { setNotificationSettings } from "@/data/storage";
import { setStore } from "@/data/store";
import { NotificationSettings as Settings } from "@/data/types";
import {
  applyNotificationSchedule,
  requestNotificationPermission,
} from "@/lib/notifications";

type Props = {
  value: Settings;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function asDate(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function NotificationSetting({ value }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const persist = async (next: Settings) => {
    const data = await setNotificationSettings(next);
    setStore(data);
    try {
      await applyNotificationSchedule(next);
    } catch (e) {
      console.warn("schedule failed", e);
    }
  };

  const onToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          "알림 권한 필요",
          "기기 설정에서 알림 권한을 허용해 주세요.",
        );
        return;
      }
    }
    await persist({ ...value, enabled });
  };

  const onChangeTime = async (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setPickerOpen(false);
    if (event.type === "dismissed" || !date) return;
    await persist({
      ...value,
      hour: date.getHours(),
      minute: date.getMinutes(),
    });
  };

  return (
    <View className="mx-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-base text-neutral-900 dark:text-neutral-100">
          매일 알림
        </Text>
        <Switch
          value={value.enabled}
          onValueChange={onToggle}
          trackColor={{ false: "#d4d4d8", true: "#a3c5ac" }}
          thumbColor={value.enabled ? "#5e7d68" : "#f4f4f5"}
        />
      </View>
      <View className="h-px bg-neutral-200 dark:bg-neutral-800" />
      <Pressable
        onPress={() => setPickerOpen(true)}
        disabled={!value.enabled}
        className={
          "flex-row items-center justify-between px-4 py-3 " +
          (value.enabled ? "" : "opacity-40")
        }
      >
        <Text className="text-base text-neutral-900 dark:text-neutral-100">
          알림 시각
        </Text>
        <Text className="text-base font-semibold text-sage-500">
          {pad(value.hour)}:{pad(value.minute)}
        </Text>
      </Pressable>

      {pickerOpen ? (
        <DateTimePicker
          mode="time"
          value={asDate(value.hour, value.minute)}
          onChange={onChangeTime}
          display={Platform.OS === "ios" ? "spinner" : "default"}
        />
      ) : null}
      {Platform.OS === "ios" && pickerOpen ? (
        <View className="items-end px-4 pb-2">
          <Pressable onPress={() => setPickerOpen(false)} className="px-3 py-1">
            <Text className="text-base font-semibold text-sage-500">완료</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
