import { Pressable, Text, View } from "react-native";

import { HeatCell } from "@/lib/stats";

type Props = {
  columns: HeatCell[][];
  selectedKey: string | null;
  onSelect: (key: string) => void;
};

function bgFor(completion: number, hasAny: boolean): string {
  if (completion >= 1) return "bg-sage-500";
  if (completion >= 0.75) return "bg-sage-400";
  if (completion >= 0.5) return "bg-sage-300";
  if (completion > 0) return "bg-sage-200";
  if (hasAny) return "bg-neutral-200 dark:bg-neutral-800";
  return "bg-neutral-100 dark:bg-neutral-900";
}

const WEEKDAY_LABELS = ["월", "", "수", "", "금", "", "일"];

export function Heatmap({ columns, selectedKey, onSelect }: Props) {
  return (
    <View className="mx-4 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
      <View className="flex-row">
        <View className="mr-1 justify-between py-0.5">
          {WEEKDAY_LABELS.map((d, i) => (
            <Text
              key={i}
              className="h-4 text-[10px] leading-4 text-neutral-400"
            >
              {d}
            </Text>
          ))}
        </View>
        <View className="flex-1 flex-row justify-between">
          {columns.map((col, ci) => (
            <View key={ci} className="flex-col">
              {col.map((cell) => {
                const isSelected = cell.key === selectedKey;
                return (
                  <Pressable
                    key={cell.key}
                    onPress={() => onSelect(cell.key)}
                    className="my-0.5"
                  >
                    <View
                      className={
                        "h-4 w-4 rounded-[3px] " +
                        bgFor(cell.completion, cell.hasAny) +
                        (isSelected
                          ? " border-2 border-neutral-900 dark:border-neutral-100"
                          : "")
                      }
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-end">
        <Text className="mr-2 text-[10px] text-neutral-400">적음</Text>
        <View className="mr-1 h-3 w-3 rounded-[2px] bg-neutral-100 dark:bg-neutral-800" />
        <View className="mr-1 h-3 w-3 rounded-[2px] bg-sage-200" />
        <View className="mr-1 h-3 w-3 rounded-[2px] bg-sage-300" />
        <View className="mr-1 h-3 w-3 rounded-[2px] bg-sage-400" />
        <View className="mr-2 h-3 w-3 rounded-[2px] bg-sage-500" />
        <Text className="text-[10px] text-neutral-400">많음</Text>
      </View>
    </View>
  );
}
