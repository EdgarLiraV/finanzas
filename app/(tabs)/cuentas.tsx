import CardCrypto from "@/src/components/cards/CardCrypto";
import CardEfectivo from "@/src/components/cards/CardEfectivo";
import CardTarjeta from "@/src/components/cards/CardTarjeta";
import AddCardModal from "@/src/components/modals/AddCardModal";
import FixBalanceEfectivoModal from "@/src/components/modals/FixBalanceEfectivoModal";
import FixBalanceModal from "@/src/components/modals/FixBalanceModal";
import RemoveCardModal from "@/src/components/modals/RemoveCardModal";
import Nav from "@/src/components/Nav";
import Pastel from "@/src/components/Pastel";
import { useFinancial } from "@/src/contexts/FinanciialContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { PieChart } from "react-native-gifted-charts"; // luego

export default function Cuentas() {
  const {
    getCashBalance,
    getCardsBalance,
    getAllCards,
    addCard,
    removeCard,
    fixCardBalance,
    fixCashBalance,
    isLoading,
  } = useFinancial();

  const cards = getAllCards();
  const efectivoTotal = getCashBalance();
  const tarjetasTotal = getCardsBalance();

  // Calcular distribución por tarjeta
  const distribution = cards.map((c) => ({
    id: c.id,
    name: c.name,
    usd: c.balance,
    percent: tarjetasTotal > 0 ? Math.round((c.balance / tarjetasTotal) * 100) : 0,
  }));

  // MODALES
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [fixOpen, setFixOpen] = useState(false);
  const [fixEfectivoOpen, setFixEfectivoOpen] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-base2 justify-center items-center">
        <Text className="text-texto1">Cargando...</Text>
      </SafeAreaView>
    );
  }
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
            totalUSD={tarjetasTotal}
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
        onSubmit={(name) => {
          addCard(name, 0); // Nueva tarjeta empieza en $0
        }}
      />

      <RemoveCardModal
        visible={removeOpen}
        onClose={() => setRemoveOpen(false)}
        cards={cards}
        onRemove={(id) => removeCard(id)}
      />

      <FixBalanceModal
        visible={fixOpen}
        onClose={() => setFixOpen(false)}
        cards={cards}
        onSubmit={(updatedCards) => {
          updatedCards.forEach((updated) => {
            fixCardBalance(updated.id, updated.usd);
          });
        }}
      />

      <FixBalanceEfectivoModal
        visible={fixEfectivoOpen}
        totalUSD={efectivoTotal}
        onClose={() => setFixEfectivoOpen(false)}
        onSubmit={(newAmount) => fixCashBalance(newAmount)}
      />
    </SafeAreaView>
  );
}