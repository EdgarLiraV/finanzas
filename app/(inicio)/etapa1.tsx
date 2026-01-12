import Piggy from "@/src/assets/images/piggy.svg";
import { useUserStore } from "@/src/store/userStore";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
export default function Etapa1() {
  const setUserId = useUserStore((s) => s.setUserId);
  const handleStart = () => {
    setUserId("user_demo_123");
    router.replace("../(tabs)/home");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-base1">
        <View className="flex-1 items-center">
          <View className="flex h-3/5 justify-center">
            <Piggy width={250} height={250} />
          </View>
          <View className="flex-1 items-center w-full gap-5 py-10 bg-base2 rounded-t-3xl">
            <Text className="font-vs-bold text-texto1 text-center text-5xl">
              Administra tu patrimonio.
            </Text>
            <Text className="font-vs-medium text-texto2 text-center text-lg px-[20%]">
              Ten control total de tu dinero on-chain y fisico.
            </Text>
            <Pressable 
              onPress={handleStart}
              className="bg-acento rounded-full py-5 w-5/6 items-center mt-5"
            >
              <Text className="text-white font-vs-medium text-xl">
                Empezar     →
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
