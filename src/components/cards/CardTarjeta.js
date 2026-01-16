import { Pressable, Text, View } from "react-native";

export default function CardTarjeta({
  totalUSD,
  fullDistribution,
  onAddCard,
  onRemoveCard,
  onFixBalance,
}) {
  return (
    <View className="flex bg-base2 rounded-2xl p-5 gap-4">
      {/* HEADER */}
      <View className="gap-2">
        <Text className="font-vs-medium text-texto2 text-lg">Tarjetas</Text>
        <Text className="font-vs-bold text-texto1 text-3xl">
          ${totalUSD.toLocaleString()}
        </Text>
      </View>

      {/* DISTRIBUCIÓN */}
      {fullDistribution.map((item) => (
        <View
          key={item.id ?? item.name}
          className="flex-row justify-between"
        >
          <Text className="text-texto1 font-vs-regular">{item.name}</Text>
          <Text className="text-texto1 font-vs-regular">
            {item.percent}% · ${item.usd.toLocaleString()}
          </Text>
        </View>
      ))}

      {/* BOTONES */}
      <View className="flex-row justify-between mt-2">
        <Pressable onPress={onAddCard}>
          <Text className="text-green-400 font-vs-medium">+ Añadir</Text>
        </Pressable>

        <Pressable onPress={onRemoveCard}>
          <Text className="text-red-400 font-vs-medium">Eliminar</Text>
        </Pressable>

        <Pressable onPress={onFixBalance}>
          <Text className="text-yellow-400 font-vs-medium">Corregir</Text>
        </Pressable>
      </View>
    </View>
  );
}
