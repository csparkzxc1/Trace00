import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import { ChecklistItem } from "@/data/types";
import {
  addItem,
  deleteItem,
  reorderItems,
  updateItem,
} from "@/data/storage";
import { setStore } from "@/data/store";

type Props = {
  items: ChecklistItem[];
};

export function ItemManager({ items }: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const onAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const next = await addItem(trimmed);
    setStore(next);
    setNewName("");
  };

  const onStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const onSaveEdit = async () => {
    if (!editingId) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const next = await updateItem(editingId, { name: trimmed });
    setStore(next);
    setEditingId(null);
  };

  const onDelete = (id: string, name: string) => {
    Alert.alert("항목 삭제", `"${name}" 항목을 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const next = await deleteItem(id);
          setStore(next);
        },
      },
    ]);
  };

  const onMove = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((it) => it.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(idx, 1);
    if (!moved) return;
    next.splice(target, 0, moved);
    const result = await reorderItems(next.map((it) => it.id));
    setStore(result);
  };

  return (
    <View>
      <View className="mx-4 flex-row items-center rounded-2xl bg-neutral-50 p-2 dark:bg-neutral-900">
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="새 항목 추가..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={onAdd}
          returnKeyType="done"
          className="flex-1 px-3 py-2 text-base text-neutral-900 dark:text-neutral-100"
        />
        <Pressable
          onPress={onAdd}
          disabled={!newName.trim()}
          className={
            "rounded-xl px-4 py-2 " +
            (newName.trim() ? "bg-sage-500" : "bg-neutral-300 dark:bg-neutral-700")
          }
        >
          <Text className="font-semibold text-white">추가</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View className="mx-5 my-4 rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <Text className="text-center text-neutral-500">
            아직 항목이 없습니다.
          </Text>
        </View>
      ) : (
        items.map((it, idx) => (
          <View
            key={it.id}
            className="mx-4 mt-2 flex-row items-center rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900"
          >
            <View className="mr-2">
              <Pressable
                onPress={() => onMove(it.id, -1)}
                disabled={idx === 0}
                className={"px-1 py-0.5 " + (idx === 0 ? "opacity-30" : "")}
              >
                <Text className="text-base text-neutral-600 dark:text-neutral-400">
                  ▲
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onMove(it.id, 1)}
                disabled={idx === items.length - 1}
                className={
                  "px-1 py-0.5 " +
                  (idx === items.length - 1 ? "opacity-30" : "")
                }
              >
                <Text className="text-base text-neutral-600 dark:text-neutral-400">
                  ▼
                </Text>
              </Pressable>
            </View>

            {editingId === it.id ? (
              <TextInput
                value={editName}
                onChangeText={setEditName}
                onSubmitEditing={onSaveEdit}
                onBlur={onSaveEdit}
                autoFocus
                returnKeyType="done"
                className="flex-1 rounded-lg bg-white px-2 py-2 text-base text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
              />
            ) : (
              <Pressable
                className="flex-1"
                onPress={() => onStartEdit(it.id, it.name)}
              >
                <Text className="px-2 py-2 text-base text-neutral-900 dark:text-neutral-100">
                  {it.name}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => onDelete(it.id, it.name)}
              className="ml-2 px-3 py-2"
            >
              <Text className="text-base text-rose-500">삭제</Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}
