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
    { value: 0, label: "1" },
    { value: 100, label: "2" },
    { value: 250, label: "3" },
    { value: 500, label: "4" },
    { value: 300, label: "5" },
    { value: 600, label: "6" },
    { value: 1000, label: "7" },
    { value: 1200, label: "8" },
    { value: 800, label: "9" },
    { value: 2000, label: "10" },
    { value: 2500, label: "11" },
    { value: 2000, label: "12" },
    { value: 3000, label: "13" },
    { value: 3300, label: "14" },
    { value: 4500, label: "15" },
    { value: 3800, label: "16" },
    { value: 5000, label: "17" },
    { value: 5600, label: "18" },
    { value: 5000, label: "19" },
    { value: 7000, label: "20" },
    { value: 6300, label: "21" },
    { value: 7200, label: "22" },
    { value: 8800, label: "23" },
    { value: 10000, label: "24" },
    { value: 10200, label: "25" },
    { value: 9800, label: "26" },
    { value: 10500, label: "27" },
    { value: 11000, label: "28" },
    { value: 10800, label: "29" },
    { value: 11200, label: "30" },
  ];

  const quarterlyData = [
    { value: 0, label: "E" },
    { value: 1000, label: "" },
    { value: 1500, label: "F" },
    { value: 4000, label: "" },
    { value: 5000, label: "M" },
    { value: 0, label: "" },
    { value: 9000, label: "A" },
  ];
  
  const semiAnnualData = [
    { value: 8500, label: "E" },
    { value: 9200, label: "F" },
    { value: 11200, label: "M" },
    { value: 9800, label: "A" },
    { value: 12000, label: "M" },
    { value: 13500, label: "J" },
  ];

  const yearlyData = [
    { value: 5000, label: "E" },
    { value: 6200, label: "F" },
    { value: 7800, label: "M" },
    { value: 9000, label: "A" },
    { value: 11200, label: "M" },
    { value: 9800, label: "J" },
    { value: 12000, label: "J" },
    { value: 13500, label: "A" },
    { value: 15000, label: "S" },
    { value: 17000, label: "O" },
    { value: 18500, label: "N" },
    { value: 20000, label: "D" },
  ];

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

    const getXAxisLabelMarginLeft = (period) => {
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
        formatYLabel={(v) => `${Math.round(v / 1000)}k`}
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
