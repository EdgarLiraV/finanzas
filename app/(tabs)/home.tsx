import Up from "@/src/assets/icons/down.svg";
import Eye from "@/src/assets/icons/eye.svg";
import EyeClose from "@/src/assets/icons/eyeclose.svg";
import Transfer from "@/src/assets/icons/transfer.svg";
import Down from "@/src/assets/icons/up.svg";
import PortfolioChart from "@/src/components/Chart";
import MovimientoItem from "@/src/components/Movimiento";
import MovimientoModal from "@/src/components/MovimientoModal";
import Nav from "@/src/components/Nav";
import { useFinancial } from "@/src/contexts/FinanciialContext";
import { useMovimientosStore } from "@/src/store/movimientosStore";
import { useUserStore } from "@/src/store/userStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Metodo = "efectivo" | "tarjeta";

export type Movimiento = {
  id: string;
  tipo: "ingreso" | "gasto" | "transferencia";
  categoria?: string;
  metodo?: Metodo;
  desde?: Metodo;
  hacia?: Metodo;
  concepto: string;
  cantidad: number;
  fecha: string;
};

export default function Home() {
  // ========== FINANCIAL CONTEXT ==========
  const { getTotalBalance, getDailyPnL, isLoading } = useFinancial();
  
  const balanceMXN = getTotalBalance(); // Ahora la base es MXN
  const pnlMXN = getDailyPnL();
  
  // Calcular % del PnL
  const pnlPercent = (() => {
    const yesterdayBalance = balanceMXN - pnlMXN;
    if (yesterdayBalance === 0) return 0;
    return ((pnlMXN / yesterdayBalance) * 100).toFixed(2);
  })();

  const pnlSign = pnlMXN >= 0 ? "+" : "";

  // ========== MONEDA GLOBAL (MXN Y USD) ==========
  const [usdToMxn, setUsdToMxn] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const monedas = ["MXN", "USD"]; // MXN primero (default)
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("MXN"); // Default: MXN

  // Precio Dólar
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=MXN"
        );
        const data = await res.json();
        if (data?.rates?.MXN) {
          setUsdToMxn(data.rates.MXN);
        } else {
          console.warn("No se pudo obtener MXN, usando fallback");
          setUsdToMxn(20); // Actualizado a tipo de cambio más reciente
        }
      } catch (error) {
        console.error("Error obteniendo tipo de cambio", error);
        setUsdToMxn(20);
      } finally {
        setLoadingRate(false);
      }
    };
    fetchRate();
  }, []);

  // Conversión INVERTIDA: Base MXN → USD
  const getAmountByCurrency = (amountMXN: number): number | null => {
    if (currency === "MXN") return amountMXN;
    if (currency === "USD" && usdToMxn != null) {
      return amountMXN / usdToMxn; // Dividir para convertir MXN → USD
    }
    return null;
  };

  // Enseñar y mostrar balance
  const [showOcultar, setOcultar] = useState(false);
  const formatBalance = (
    amount: number | null | undefined,
    hidden: boolean
  ): string => {
    if (hidden || amount == null) return "*****.**";

    const symbol = currency === "MXN" ? "$" : "$";

    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ========== CERRAR SESIÓN ==========
  const clearUser = useUserStore((s) => s.clearUser);
  const handleLogout = () => {
    clearUser();
    router.replace("/(inicio)/etapa1");
  };

  // ========== MOVIMIENTOS ==========
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] =
    useState<"ingreso" | "gasto" | "transferencia">("gasto");
  const movimientos = useMovimientosStore((s) => s.movimientos);
  const addMovimiento = useMovimientosStore((s) => s.addMovimiento);

  const handleSave = (nuevoMovimiento: Movimiento) => {
    addMovimiento(nuevoMovimiento);
    setModalVisible(false);
  };

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
        <View className="flex flex-row items-center justify-between py-6 px-[5%] bg-base2">
          <View className="flex-row gap-2 items-center">
            <View className="bg-acento py-1 px-1 rounded-full" />
            <Text className="font-vs-light text-texto1">Live</Text>
          </View>
          <Text className="font-vs-bold text-acento text-2xl">Nombre</Text>
          <Pressable
            className="w-1/12"
            onPress={() => setOcultar(!showOcultar)}
          >
            {showOcultar ? (
              <EyeClose width={20} height={20} />
            ) : (
              <Eye width={20} height={20} />
            )}
          </Pressable>
        </View>

        <View className="flex gap-2 px-[5%] py-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-vs-regular text-texto2 text-xl">
                Tu patrimonio
              </Text>
              <Text className="font-vs-bold text-texto1 text-4xl">
                {formatBalance(getAmountByCurrency(balanceMXN), showOcultar)}
              </Text>
              <View className="flex-row gap-2">
                <Text className="text-texto2 font-vs-regular">Pnl Diario</Text>
                <Text
                  className={`font-vs-regular ${
                    pnlMXN >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatBalance(getAmountByCurrency(pnlMXN), showOcultar)} (
                  {pnlSign}
                  {pnlPercent}%)
                </Text>
              </View>
            </View>
            <View>
              <Pressable
                className="flex-row bg-base2 py-3 px-4 rounded-full mr-5"
                onPress={() => setOpen(!open)}
              >
                <Text className="text-texto1">{currency}</Text>
                <Text className="text-texto1">▼</Text>
              </Pressable>
              {open && (
                <View className="absolute bg-base2 rounded-xl mt-12 overflow-hidden z-50 elevation-md border-base2 border-[1px]">
                  {monedas.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => {
                        setCurrency(item);
                        setOpen(false);
                      }}
                      className={`px-5 py-4 ${
                        item === currency ? "bg-base1" : ""
                      }`}
                    >
                      <Text
                        className={`text-lg ${
                          item === currency
                            ? "text-texto1 font-vs-semibold"
                            : "text-texto2"
                        }`}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="mx-[5%]">
          <PortfolioChart />
        </View>

        <Text className="text-texto1 text-2xl px-[8%] pt-10 font-vs-bold">
          Añadir movimientos
        </Text>
        <View className="mx-[8%] flex-row py-10 justify-between">
          <View className="flex gap-2">
            <Pressable
              className="flex bg-base2 rounded-xl px-7 py-7 items-center"
              onPress={() => {
                setModalTipo("ingreso");
                setModalVisible(true);
              }}
            >
              <Down height={30} width={30} />
            </Pressable>
            <Text className="text-texto2 text-center">Ingreso</Text>
          </View>
          <View className="flex gap-2">
            <Pressable
              className="flex bg-base2 rounded-xl px-7 py-7 items-center"
              onPress={() => {
                setModalTipo("gasto");
                setModalVisible(true);
              }}
            >
              <Up height={30} width={30} />
            </Pressable>
            <Text className="text-texto2 text-center">Gasto</Text>
          </View>
          <View className="flex gap-2">
            <Pressable
              className="flex bg-base2 rounded-xl px-7 py-7 items-center"
              onPress={() => {
                setModalTipo("transferencia");
                setModalVisible(true);
              }}
            >
              <Transfer height={30} width={30} />
            </Pressable>
            <Text className="text-texto2 text-center">Transferencia</Text>
          </View>
        </View>

        <View className="flex mb-28 mx-[5%] px-5 py-5 bg-base2 rounded-3xl max-h-96 overflow-hidden">
          <View className="flex-row justify-between px-2 pt-3 pb-8">
            <Text className="text-texto1 font-vs-bold text-xl">
              Ultimos movimientos
            </Text>
            <Pressable onPress={() => router.push("/movimientos")}>
              <Text className="text-texto2 font-vs-light underline right-3">
                Ver mas
              </Text>
            </Pressable>
          </View>
          <View className="h-72 z-50">
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {movimientos.slice(0, 10).map((mov) => (
                <MovimientoItem key={mov.id} movimiento={mov} />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 w-screen items-center">
        <Nav screenActual="home" />
      </View>

      <MovimientoModal
        visible={modalVisible}
        tipo={modalTipo}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}