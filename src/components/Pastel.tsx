import { useFinancial } from "@/src/contexts/FinanciialContext";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type SegmentData = {
  label: string;
  value: number;
  percent: number;
  color: string;
};

export default function Pastel() {
  const { getCashBalance, getCardsBalance, getTotalBalance } = useFinancial();

  const [activo, setActivo] = useState<SegmentData | null>(null);
  const [chartKey, setChartKey] = useState(0);

  const handlePressSegment = (item: SegmentData) => {
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

  const cashBalance = getCashBalance();
  const cardsBalance = getCardsBalance();
  const total = getTotalBalance();

  // Si no hay dinero, mostrar vacío
  if (total === 0) {
    return (
      <View className="mx-[6%] bg-base2 rounded-3xl py-8 items-center">
        <Text className="text-texto2">No hay datos para mostrar</Text>
      </View>
    );
  }

  const data = [
    {
      value: cardsBalance,
      color: "#60A5FA",
      label: "Tarjeta",
      strokeWidth: activo?.label === "Tarjeta" ? 6 : 0,
      strokeColor: "#60a5fa",
    },
    {
      value: cashBalance,
      color: "#22C55E",
      label: "Efectivo",
      strokeWidth: activo?.label === "Efectivo" ? 6 : 0,
      strokeColor: "#22c55e",
    },
  ]
    .filter((item) => item.value > 0) // Solo mostrar si hay dinero
    .map((item) => ({
      ...item,
      percent: Math.round((item.value / total) * 100),
    }));

  return (
    <Pressable
      onPress={() => {
        setActivo(null);
        setChartKey((k) => k + 1);
      }}
      className="mx-[6%] bg-base2 rounded-3xl py-8 items-center overflow-visible"
    >
      <View
        style={{
          width: 220,
          height: 220,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
              style={{ width: 120, height: 120 }}
            >
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
              <Text className="text-texto1">{item.label}</Text>
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