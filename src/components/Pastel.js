import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

/* -------- DATOS -------- */
const Dinero = {
    Crypto: 15000,
    Efectivo: 5000,
    Tarjeta: 5000,
};

export default function Pastel() {
    const [activo, setActivo] = useState(null);
    const [chartKey, setChartKey] = useState(0);

    const handlePressSegment = (item) => {
        if (activo && activo.label === item.label) {
            setActivo(null);
            setChartKey((k) => k + 1);
            return;
        }
        setActivo({
            label: item.label,
            value: item.value,
            percent: item.percent,
            color: item.color,
        });
    };

    const total =
        Dinero.Crypto + Dinero.Efectivo + Dinero.Tarjeta;

    const data = [
        {
            value: Dinero.Crypto,
            color: "#A855F7",
            label: "Crypto",
            strokeWidth: activo?.label === "Crypto" ? 6 : 0,
            strokeColor: "#a855f7",
        },
        {
            value: Dinero.Efectivo,
            color: "#22C55E",
            label: "Efectivo",
            strokeWidth: activo?.label === "Efectivo" ? 6 : 0,
            strokeColor: "#22c55e",
        },
        {
            value: Dinero.Tarjeta,
            color: "#60A5FA",
            label: "Tarjeta",
            strokeWidth: activo?.label === "Tarjeta" ? 6 : 0,
            strokeColor: "#60a5fa",
        },
    ].map((item) => ({
        ...item,
        percent: Math.round((item.value / total) * 100),
    }));

    
    return (
        <Pressable
            onPress={() => { setActivo(null); setChartKey((k) => k+1); }}
            className="mx-[6%] bg-base2 rounded-3xl py-8 items-center overflow-visible"
        >
        <View style={{
            width: 220,
            height: 220,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <PieChart
                key={chartKey}
                donut
                radius={90}
                innerRadius={60}
                extraRadius={10}
                data={data}
                onPress={handlePressSegment}
                centerLabelComponent={() => (
                    <View 
                        className="items-center justify-center rounded-full bg-base2"
                        style={{ width: 120, height: 120 }}>
                        {activo ? (
                            <>
                                <Text className="text-texto2">{activo.label}</Text>
                                <Text className="text-texto1 font-vs-bold text-xl">
                                    ${activo.value.toLocaleString()}
                                </Text>
                                <Text className="text-texto2">{activo.percent}%</Text>
                            </>
                        ) : (
                            <>
                                <Text className="text-texto2">Total</Text>
                                <Text className="text-texto1 font-vs-bold text-xl">
                                    ${total.toLocaleString()}
                                </Text>
                            </>
                        )}
                    </View>
                )}
            />
            </View>

            <View className="mt-6 gap-3 w-full px-8">
                {data.map((item) => (
                    <View
                        key={item.label}
                        className="flex-row justify-between items-center"
                    >
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <Text className="text-texto1">
                                {item.label}
                            </Text>
                        </View>
                        <Text className="text-texto2">
                            ${item.value.toLocaleString()} · {item.percent}%
                        </Text>
                    </View>
                ))}
            </View>
        </Pressable>
    );
}
