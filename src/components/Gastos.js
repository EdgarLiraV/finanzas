import Hamburguesa from "@/src/assets/icons/hamburuesa.svg";
import { Text, View } from "react-native";
export default function Gastos() {
    return(
        <View className="flex-row bg-base1 rounded-3xl justify-between px-5 py-3 items-center">   
            <View className="flex-row items-center gap-3">
                <View className="bg-base2 items-center rounded-full p-3">
                    <Hamburguesa height={25} width={25}/>
                </View>
                <View className="flex gap-2">
                    <Text className="text-texto1 font-vs-medium">Comida</Text>
                    <Text className="text-texto1 font-vs-light">14/01/2026</Text>
                </View>
            </View>
            <Text className="text-perdida font-vs-">
                -$230.50
            </Text>
        </View>
    );
}
