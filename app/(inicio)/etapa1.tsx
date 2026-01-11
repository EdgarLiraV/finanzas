import { useUserStore } from "@/src/store/userStore";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Etapa1() {
  const setUserId = useUserStore((s) => s.setUserId);

  const handleStart = () => {
    // Simula que el usuario inició sesión
    setUserId("user_demo_123");
    router.replace("../(tabs)/home");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-4 text-center">
        Bienvenido 👋
      </Text>

      <Text className="text-base text-gray-500 text-center mb-8">
        Administra tu patrimonio, cripto y cuentas en un solo lugar.
      </Text>

      <Pressable
        onPress={handleStart}
        className="bg-black px-8 py-4 rounded-xl"
      >
        <Text className="text-white text-base font-semibold">
          Empezar
        </Text>
      </Pressable>
    </View>
  );
}
