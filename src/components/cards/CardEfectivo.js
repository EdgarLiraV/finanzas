import { Pressable, Text, View } from "react-native";

export default function CardEfectivo({ totalUSD, onFixBalance }) {
  return (
    <View className="flex bg-base2 rounded-2xl p-5 gap-4">
      {/* HEADER */}
      <View className="gap-2">
        <Text className="font-vs-medium text-texto2 text-lg">Efectivo</Text>
        <Text className="font-vs-bold text-texto1 text-3xl">
          ${totalUSD.toLocaleString()}
        </Text>
      </View>

      {/* BOTÓN CORREGIR */}
      <View className="flex-row mt-2">
        <Pressable onPress={onFixBalance}>
          <Text className="text-yellow-400 font-vs-medium">Corregir</Text>
        </Pressable>
      </View>
    </View>
  );
}
