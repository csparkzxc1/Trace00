import { Tabs } from "expo-router";
import { Text, useColorScheme } from "react-native";

type TabIconProps = {
  focused: boolean;
  emoji: string;
};

function TabIcon({ focused, emoji }: TabIconProps) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7C9885",
        tabBarInactiveTintColor: isDark ? "#888" : "#999",
        tabBarStyle: {
          backgroundColor: isDark ? "#0b0f0c" : "#ffffff",
          borderTopColor: isDark ? "#222" : "#eee",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "오늘",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="✓" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "기록",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📊" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="⚙" />,
        }}
      />
    </Tabs>
  );
}
