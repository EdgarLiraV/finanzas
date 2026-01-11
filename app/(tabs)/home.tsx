import { useUserStore } from "@/src/store/userStore";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Home() {
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = () => {
    clearUser();
    router.replace("/(inicio)/etapa1");
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      {/* Saludo */}
      <Text className="text-2xl font-semibold mb-2">
        Hola 👋
      </Text>
      <Text className="text-gray-500 mb-6">
        Este es el resumen de tu patrimonio
      </Text>

      {/* Patrimonio */}
      <View className="bg-black rounded-2xl p-6 mb-6">
        <Text className="text-gray-400 mb-1">Patrimonio total</Text>
        <Text className="text-white text-3xl font-bold">
          $10,000
        </Text>
        <Text className="text-green-400 mt-1">
          +10.5% este mes
        </Text>
      </View>

      {/* Distribución */}
      <View className="bg-gray-100 rounded-2xl p-6 mb-6">
        <Text className="text-lg font-semibold mb-4">
          Distribución
        </Text>

        <Text className="text-gray-700 mb-1">Cripto: $6,000 (60%)</Text>
        <Text className="text-gray-700 mb-1">Tarjetas: $3,000 (30%)</Text>
        <Text className="text-gray-700">Efectivo: $1,000 (10%)</Text>
      </View>

      {/* Accesos rápidos */}
      <View className="flex-row justify-between mb-10">
        <Pressable className="flex-1 bg-green-500 py-4 rounded-xl mr-3">
          <Text className="text-white text-center font-semibold">
            + Dinero
          </Text>
        </Pressable>

        <Pressable className="flex-1 bg-red-500 py-4 rounded-xl ml-3">
          <Text className="text-white text-center font-semibold">
            - Dinero
          </Text>
        </Pressable>
      </View>

      {/* Logout (solo debug) */}
      <Pressable onPress={handleLogout}>
        <Text className="text-center text-gray-400">
          Cerrar sesión
        </Text>
      </Pressable>
    </ScrollView>
  );
}
