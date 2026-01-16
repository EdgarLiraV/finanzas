import CardCrypto from "@/src/components/cards/CardCrypto";
import CardEfectivo from "@/src/components/cards/CardEfectivo";
import CardTarjeta from "@/src/components/cards/CardTarjeta";
import AddCardModal from "@/src/components/modals/AddCardModal";
import FixBalanceEfectivoModal from "@/src/components/modals/FixBalanceEfectivoModal";
import FixBalanceModal from "@/src/components/modals/FixBalanceModal";
import RemoveCardModal from "@/src/components/modals/RemoveCardModal";
import Nav from "@/src/components/Nav";
import Pastel from "@/src/components/Pastel";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { PieChart } from "react-native-gifted-charts"; // luego

export default function Cuentas() {
  const [cards, setCards] = useState([
    { id: "1", name: "Revolut", usd: 3200 },
    { id: "2", name: "BBVA", usd: 1800 },
]);

const [efectivoTotal, setEfectivoTotal] = useState(5000);
const [fixEfectivoOpen, setFixEfectivoOpen] = useState(false);

const totalUSD = cards.reduce((s, c) => s + c.usd, 0);

const distribution = cards.map((c) => ({
    id: c.id,
    name: c.name,
    usd: c.usd,
    percent: Math.round((c.usd / totalUSD) * 100),
}));

// MODALES
const [addOpen, setAddOpen] = useState(false);
const [removeOpen, setRemoveOpen] = useState(false);
const [fixOpen, setFixOpen] = useState(false);

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

                <CardTarjeta
                  totalUSD={totalUSD}
                  fullDistribution={distribution}
                  onAddCard={() => setAddOpen(true)}
                  onRemoveCard={() => setRemoveOpen(true)}
                  onFixBalance={() => setFixOpen(true)}
                />
                <View className="mb-20">
                  <CardEfectivo
                    totalUSD={efectivoTotal}
                    onFixBalance={() => setFixEfectivoOpen(true)}
                  />
                </View>
                </View>
            </ScrollView>
            <View className="absolute bottom-10 w-screen items-center">
                <Nav screenActual="cuentas"/>
            </View>




            <AddCardModal
                visible={addOpen}
                onClose={() => setAddOpen(false)}
                onSubmit={(name) =>
                    setCards((prev) => [
                        ...prev,
                        { id: Date.now().toString(), name, usd: 0 },
                    ])
                }
            />

            <RemoveCardModal
                visible={removeOpen}
                onClose={() => setRemoveOpen(false)}
                cards={cards}
                onRemove={(id) =>
                    setCards((prev) => prev.filter((c) => c.id !== id))
                }
            />

            <FixBalanceModal
              visible={fixOpen}
              onClose={() => setFixOpen(false)}
              cards={cards}
              onSubmit={(updatedCards) => {
                setCards((prev) =>
                  prev.map((c) => {
                    const updated = updatedCards.find((u) => u.id === c.id);
                    return updated ? { ...c, usd: updated.usd } : c;
                  })
                );
              }}  
            />

            <FixBalanceEfectivoModal
              visible={fixEfectivoOpen}
              totalUSD={efectivoTotal}
              onClose={() => setFixEfectivoOpen(false)}
              onSubmit={(newAmount) => setEfectivoTotal(newAmount)}
            />


            
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
