import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  children: ReactNode;
  hint?: string;
};

export function Section({ title, children, hint }: Props) {
  return (
    <View className="mt-6">
      <Text className="mx-5 mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </Text>
      {children}
      {hint ? (
        <Text className="mx-5 mt-2 text-xs text-neutral-400">{hint}</Text>
      ) : null}
    </View>
  );
}
