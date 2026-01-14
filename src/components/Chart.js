import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

/* ---------- HELPERS ---------- */
const formatMonthlyLabels = (data, visibleLabels = 8) => {
  const interval = Math.ceil(data.length / visibleLabels);

  return data.map((item, index) => {
    if (
      index === 0 ||
      index === data.length - 1 ||
      index % interval === 0
    ) {
      return item;
    }
    return { ...item, label: "" };
  });
};

export default function PortfolioChart() {
  const [period, setPeriod] = useState("1W");

  /* ---------- DATA ---------- */
  const weeklyData = [
    { value: 10000, label: "L" },
    { value: 10200, label: "M" },
    { value: 9800, label: "X" },
    { value: 10500, label: "J" },
    { value: 11000, label: "V" },
    { value: 10800, label: "S" },
    { value: 11200, label: "D" },
  ];

  const monthlyData = [
    { value: 9000, label: "1" },
    { value: 9200, label: "2" },
    { value: 9400, label: "3" },
    { value: 9300, label: "4" },
    { value: 9500, label: "5" },
    { value: 9700, label: "6" },
    { value: 9900, label: "7" },
    { value: 9800, label: "8" },
    { value: 10000, label: "9" },
    { value: 10200, label: "10" },
    { value: 10100, label: "11" },
    { value: 10300, label: "12" },
    { value: 10500, label: "13" },
    { value: 10400, label: "14" },
    { value: 10600, label: "15" },
    { value: 10800, label: "16" },
    { value: 11000, label: "17" },
    { value: 10900, label: "18" },
    { value: 11100, label: "19" },
    { value: 11300, label: "20" },
    { value: 11400, label: "21" },
    { value: 11600, label: "22" },
    { value: 11500, label: "23" },
    { value: 11700, label: "24" },
    { value: 11900, label: "25" },
    { value: 12100, label: "26" },
    { value: 12300, label: "27" },
    { value: 12200, label: "28" },
    { value: 12400, label: "29" },
    { value: 12600, label: "30" },
  ];

  /* ---------- DATA SELECTOR ---------- */
  const chartData =
    period === "1W"
      ? weeklyData
      : formatMonthlyLabels(monthlyData, 7);

  /* ---------- RENDER ---------- */
  return (
    <View className="bg-base2 rounded-2xl p-5">
      {/* ---------- CHART ---------- */}
      <LineChart
        disableScroll
        data={chartData}
        height={190}
        yAxisExtraHeight={40}
        spacing={period === "1W" ? 40 : 8}
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
        formatYLabel={(v) => `${Math.round(v / 1000)}k`}
        xAxisLabelTextStyle={{
          color: "#A1A1AA",
          fontSize: 11,
          width: 24,
          textAlign: "center",
          marginLeft: period === "1M" ? -8 : 8,
        }}
        isAnimated
        animationDuration={700}
        initialSpacing={10}
        endSpacing={10}
        focusEnabled
        showStripOnFocus
        showTextOnFocus
        focusedDataPointLabelComponent={(item) => (
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
        <Pressable
          onPress={() => setPeriod("1W")}
          className={`px-4 py-1 rounded-full ${
            period === "1W" ? "bg-base1" : ""
          }`}
        >
          <Text className={period === "1W" ? "text-white" : "text-texto2"}>
            1W
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPeriod("1M")}
          className={`px-4 py-1 rounded-full ${
            period === "1M" ? "bg-base1" : ""
          }`}
        >
          <Text className={period === "1M" ? "text-white" : "text-texto2"}>
            1M
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
