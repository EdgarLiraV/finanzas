import { useUserStore } from "@/src/store/userStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const userId = useUserStore((s) => s.userId);
  const isHydrated = useUserStore((s) => s.isHydrated);
  console.log(userId)
  useEffect(() => {
    if (!isHydrated) return;

    if (userId) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(inicio)/etapa1");
    }
  }, [isHydrated, userId]);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
