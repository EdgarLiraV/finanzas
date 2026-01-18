import { useFinancial } from "@/src/contexts/FinanciialContext";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

/* ---------- HELPERS ---------- */
type ChartDataPoint = {
  value: number;
  label: string;
};

const formatMonthlyLabels = (data: ChartDataPoint[], visibleLabels = 8): ChartDataPoint[] => {
  const interval = Math.ceil(data.length / visibleLabels);

  return data.map((item, index) => {
    if (index === 0 || index === data.length - 1 || index % interval === 0) {
      return item;
    }
    return { ...item, label: "" };
  });
};

const getDayLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ["D", "L", "M", "X", "J", "V", "S"];
  return days[date.getDay()];
};

const getMonthLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return months[date.getMonth()];
};

const getDayOfMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getDate().toString();
};

export default function PortfolioChart() {
  const [period, setPeriod] = useState("1W");
  const { getSnapshots } = useFinancial();

  /* ---------- DATA FROM CONTEXT ---------- */
  const weeklySnapshots = getSnapshots("weekly");
  const monthlySnapshots = getSnapshots("monthly");
  const quarterlySnapshots = getSnapshots("quarterly");
  const semiannualSnapshots = getSnapshots("semiannual");
  const annualSnapshots = getSnapshots("annual");

  // Convertir snapshots a formato de gráfica
  const weeklyData = weeklySnapshots
    .slice()
    .reverse()
    .map((s) => ({
      value: s.totalBalance,
      label: getDayLabel(s.date),
    }));

  const monthlyData = monthlySnapshots
    .slice()
    .reverse()
    .map((s) => ({
      value: s.totalBalance,
      label: getDayOfMonth(s.date),
    }));

  const quarterlyData = quarterlySnapshots
    .slice()
    .reverse()
    .map((s, idx) => ({
      value: s.totalBalance,
      label: idx % 15 === 0 ? getMonthLabel(s.date) : "",
    }));

  const semiAnnualData = semiannualSnapshots
    .slice()
    .reverse()
    .map((s, idx) => ({
      value: s.totalBalance,
      label: idx % 30 === 0 ? getMonthLabel(s.date) : "",
    }));

  const yearlyData = annualSnapshots
    .slice()
    .reverse()
    .map((s, idx) => ({
      value: s.totalBalance,
      label: idx % 30 === 0 ? getMonthLabel(s.date) : "",
    }));

  /* ---------- DATA SELECTOR ---------- */
  const chartData =
    period === "1W"
      ? weeklyData
      : period === "1M"
      ? formatMonthlyLabels(monthlyData, 7)
      : period === "3M"
      ? quarterlyData
      : period === "6M"
      ? semiAnnualData
      : yearlyData;

  const getXAxisLabelMarginLeft = (period: string): number => {
    switch (period) {
      case "1W":
        return 8;
      case "1M":
        return -8;
      case "3M":
        return 8;
      case "6M":
        return 13;
      case "1Y":
        return -1;
      default:
        return 0;
    }
  };

  // Si no hay datos, mostrar mensaje
  if (chartData.length === 0) {
    return (
      <View className="bg-base2 rounded-2xl p-5 items-center">
        <Text className="text-texto2">
          No hay suficientes datos para mostrar la gráfica
        </Text>
        <Text className="text-texto2 text-xs mt-2">
          Los datos se generan automáticamente cada día
        </Text>
      </View>
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <View className="bg-base2 rounded-2xl p-5">
      {/* ---------- CHART ---------- */}
      <LineChart
        disableScroll
        data={chartData}
        height={190}
        yAxisExtraHeight={40}
        spacing={
          period === "1W"
            ? 40
            : period === "1M"
            ? 8
            : period === "3M"
            ? 40
            : period === "6M"
            ? 50
            : 22
        }
        thickness={3}
        color="#7C3AED"
        dataPointsColor="#7C3AED"
        dataPointsRadius={0}
        hideRules
        areaChart
        startFillColor="#7C3AED"
        endFillColor="#7C3AED"
        startOpacity={0.25}
        endOpacity={0.05}
        yAxisThickness={0}
        yAxisLabelWidth={40}
        noOfSections={4}
        yAxisTextStyle={{ color: "#A1A1AA", fontSize: 11 }}
        formatYLabel={(v) => `${Math.round(Number(v) / 1000)}k`}
        xAxisLabelTextStyle={{
          color: "#A1A1AA",
          fontSize: 11,
          width: 24,
          textAlign: "center",
          marginLeft: getXAxisLabelMarginLeft(period),
        }}
        isAnimated
        animationDuration={700}
        initialSpacing={10}
        endSpacing={10}
        focusEnabled
        showStripOnFocus
        showTextOnFocus
        focusedDataPointLabelComponent={(item: { value: number }) => (
          <View className="bg-base1 px-2 py-1 rounded-xl min-w-[56px] -top-8">
            <Text className="text-texto1 text-xs font-vs-medium text-center">
              ${Math.round(item.value).toLocaleString()}
            </Text>
          </View>
        )}
        focusedDataPointRadius={5}
        focusedDataPointColor="#7C3AED"
      />

      {/* ---------- PERIOD SELECTOR ---------- */}
      <View className="flex-row justify-between mt-6">
        {["1W", "1M", "3M", "6M", "1Y"].map((p) => (
          <Pressable
            key={p}
            onPress={() => setPeriod(p)}
            className={`px-4 py-1 rounded-full ${
              period === p ? "bg-base1" : ""
            }`}
          >
            <Text className={period === p ? "text-white" : "text-texto2"}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}