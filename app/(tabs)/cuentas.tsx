import CardCrypto from "@/src/components/cards/CardCrypto";
import CardEfectivo from "@/src/components/cards/CardEfectivo";
import CardTarjeta from "@/src/components/cards/CardTarjeta";
import AddCardModal from "@/src/components/modals/AddCardModal";
import AddWalletModal from "@/src/components/modals/AddWalletModal";
import FixBalanceEfectivoModal from "@/src/components/modals/FixBalanceEfectivoModal";
import FixBalanceModal from "@/src/components/modals/FixBalanceModal";
import RemoveCardModal from "@/src/components/modals/RemoveCardModal";
import RemoveWalletModal from "@/src/components/modals/RemoveWalletModal";
import Nav from "@/src/components/Nav";
import Pastel from "@/src/components/Pastel";
import { useFinancial } from "@/src/contexts/FinanciialContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cuentas() {
  const {
    getCashBalance,
    getCardsBalance,
    getCryptoBalance,
    getAllCards,
    getAllWallets,
    addCard,
    removeCard,
    fixCardBalance,
    fixCashBalance,
    addWallet,
    removeWallet,
    refreshAllWallets,
    isLoading,
    isRefreshingCrypto,
  } = useFinancial();

  const cards = getAllCards();
  const wallets = getAllWallets();
  const efectivoTotal = getCashBalance();
  const tarjetasTotal = getCardsBalance();
  const cryptoTotal = getCryptoBalance();

  // Calcular distribución por tarjeta
  const distribution = cards.map((c) => ({
    id: c.id,
    name: c.name,
    usd: c.balance,
    percent: tarjetasTotal > 0 ? Math.round((c.balance / tarjetasTotal) * 100) : 0,
  }));

  // Consolidar todos los tokens de todas las wallets
  const allTokens = wallets.flatMap((wallet) => wallet.tokens);
  
  // Agrupar tokens por símbolo
  const consolidatedTokens = allTokens.reduce((acc, token) => {
    const existing = acc.find(t => t.symbol === token.symbol);
    if (existing) {
      existing.amount += token.amount;
      existing.usdValue += token.usdValue;
      existing.mxnValue += token.mxnValue;
    } else {
      acc.push({ ...token });
    }
    return acc;
  }, [] as typeof allTokens);

  // MODALES
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [fixOpen, setFixOpen] = useState(false);
  const [fixEfectivoOpen, setFixEfectivoOpen] = useState(false);
  const [addWalletOpen, setAddWalletOpen] = useState(false);
  const [removeWalletOpen, setRemoveWalletOpen] = useState(false);

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
            Distribución
          </Text>
        </View>

        <Pastel />

        <View className="mt-8 px-[6%] gap-4 mb-10">
          <CardCrypto
            totalMXN={cryptoTotal}
            tokens={consolidatedTokens}
            wallets={wallets.map(w => ({ 
              id: w.id, 
              address: w.address, 
              nickname: w.nickname 
            }))}
            onAddWallet={() => setAddWalletOpen(true)}
            onRemoveWallet={() => setRemoveWalletOpen(true)}
            onRefresh={refreshAllWallets}
            isRefreshing={isRefreshingCrypto}
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
        <Nav screenActual="cuentas" />
      </View>

      {/* ========== MODALES ========== */}
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

      <AddWalletModal
        visible={addWalletOpen}
        onClose={() => setAddWalletOpen(false)}
        onSubmit={addWallet}
        existingWallets={wallets.map(w => w.address)}
        isLoading={isRefreshingCrypto}
      />

      <RemoveWalletModal
        visible={removeWalletOpen}
        onClose={() => setRemoveWalletOpen(false)}
        wallets={wallets}
        onRemove={removeWallet}
      />
    </SafeAreaView>
  );
}