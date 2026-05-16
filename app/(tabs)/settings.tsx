import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950" edges={["top"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-neutral-900 dark:text-neutral-100">설정 탭</Text>
        <Text className="mt-2 text-sm text-neutral-500">단계 4·5에서 구현됩니다.</Text>
      </View>
    </SafeAreaView>
  );
}
