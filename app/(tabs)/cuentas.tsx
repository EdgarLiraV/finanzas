import CardCrypto from "@/src/components/cards/CardCrypto";
import Nav from "@/src/components/Nav";
import Pastel from "@/src/components/Pastel";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { PieChart } from "react-native-gifted-charts"; // luego

export default function Cuentas() {
    return (
        <SafeAreaView className="flex-1 bg-base2">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                className="bg-base1"
            >
                <View className="flex flex-row items-center justify-center py-6 px-[5%] bg-base2 mb-10">
                    <Text className="font-vs-bold text-texto1 text-2xl">
                        Distribucion
                    </Text>
                </View>

                <Pastel />

                <View className="mt-8 px-[6%] gap-4 mb-10">
                <CardCrypto
                  totalUSD={10000}
                  previewDistribution={[
                    { symbol: "SOL", percent: 50, usd: 5000 },
                    { symbol: "ETH", percent: 27, usd: 2700 },
                    { symbol: "OTRAS", percent: 23, usd: 2300 },
                  ]}
                  fullDistribution={[
                    { symbol: "SOL", percent: 50, usd: 5000 },
                    { symbol: "ETH", percent: 27, usd: 2700 },
                    { symbol: "BTC", percent: 12, usd: 1200 },
                    { symbol: "AVAX", percent: 6, usd: 600 },
                    { symbol: "SUI", percent: 5, usd: 500 },
                  ]}
                />

                    <InfoCard
                        title="Efectivo"
                        subtitle="Disponible"
                        value="$0.00"
                    />
                    <InfoCard
                        title="Tarjeta"
                        subtitle="En bancos"
                        value="$0.00"
                    />
                </View>
            </ScrollView>
            <View className="absolute bottom-10 w-screen items-center">
                <Nav screenActual="cuentas"/>
            </View>
        </SafeAreaView>
    );
}

/* ---------- COMPONENTES ---------- */


function InfoCard({
  title,
  subtitle,
  value,
}: {
  title: string;
  subtitle: string;
  value: string;
}) {
  return (
    <View className="bg-base2 rounded-2xl px-5 py-4">
      <Text className="text-texto1 font-vs-medium text-lg">
        {title}
      </Text>
      <Text className="text-texto2 text-sm mt-1">
        {subtitle}
      </Text>
      <Text className="text-texto1 font-vs-bold text-2xl mt-3">
        {value}
      </Text>
    </View>
  );
}
