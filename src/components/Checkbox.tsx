import { Pressable, Text, View } from "react-native";

type Props = {
  checked: boolean;
  label: string;
  onToggle: () => void;
};

export function Checkbox({ checked, label, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      className="mx-4 my-1.5 flex-row items-center rounded-2xl bg-neutral-50 px-4 py-4 active:opacity-70 dark:bg-neutral-900"
    >
      <View
        className={
          "h-8 w-8 items-center justify-center rounded-lg border-2 " +
          (checked
            ? "border-sage-500 bg-sage-500"
            : "border-neutral-300 bg-transparent dark:border-neutral-600")
        }
      >
        {checked ? (
          <Text className="text-base font-bold text-white">✓</Text>
        ) : null}
      </View>
      <Text
        className={
          "ml-4 flex-1 text-lg " +
          (checked
            ? "text-neutral-400 line-through dark:text-neutral-500"
            : "text-neutral-900 dark:text-neutral-100")
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
