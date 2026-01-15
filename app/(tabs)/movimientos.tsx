import Back from "@/src/assets/icons/bACK.svg";
import MovimientoItem from "@/src/components/Movimiento";
import { useMovimientosStore } from "@/src/store/movimientosStore";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MovimientosScreen() {
    const movimientos = useMovimientosStore((s) => s.movimientos);
    return (
        <SafeAreaView className="flex-1 bg-base2">
            <View className="flex-1 bg-base1">
                <View className="flex-row items-center px-[7%] py-8 bg-base2 gap-5 justify-center">
                    <Pressable onPress={() => router.back()} className="absolute left-8">
                        <Back height={20} width={20}/>
                    </Pressable>
                    <Text className="text-texto1 font-vs-bold text-2xl">
                        Todos los movimientos
                    </Text>
                </View>
                <View className="flex-1 px-[5%] py-8">
                    <View className="bg-base2 rounded-3xl">
                        <FlatList
                            data={movimientos}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <MovimientoItem movimiento={item} />
                            )}
                            contentContainerStyle={{
                                gap: 12,
                                padding: 16,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
