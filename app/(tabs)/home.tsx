import Eye from "@/src/assets/icons/eye.svg";
import EyeClose from "@/src/assets/icons/eyeclose.svg";
import Menos from "@/src/assets/icons/menos.svg";
import Plus from "@/src/assets/icons/plus.svg";
import PortfolioChart from "@/src/components/Chart";
import Gastos from "@/src/components/Gastos";
import { useUserStore } from "@/src/store/userStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Home() {
  {/* BALANCE y PNL */}
  const balanceUSD = 12000;
  const pnlUSD = 3000;
  {/* Moneda global (MXN Y USD) */}
  const [usdToMxn, setUsdToMxn] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const monedas = ["USD", "MXN"]
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  {/* Precio Dolar */}
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
          setUsdToMxn(17);
        }
      } catch (error) {
        console.error("Error obteniendo tipo de cambio", error);
        setUsdToMxn(17);
      } finally {
        setLoadingRate(false);
      }
    };
    fetchRate();
  }, []);
  {/* Correciones de cambio */}
  const getAmountByCurrency = (amountUSD: number): number | null => {
    if (currency === "USD") return amountUSD;
    if (currency === "MXN" && usdToMxn != null) {
      return amountUSD * usdToMxn;
    }
    return null;
  };
  {/* Enseñar y mostrar balance */}
  const [showOcultar, setOcultar] = useState(false);
  const formatBalance = (
    amount: number | null | undefined,
    hidden: boolean
  ): string => {
    if (hidden || amount == null) return "*****.**";
  
    const symbol = currency === "USD" ? "$" : "$";
  
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  

  {/* Cerrar sesion */}
  const clearUser = useUserStore((s) => s.clearUser);
  const handleLogout = () => {
    clearUser();
    router.replace("/(inicio)/etapa1");
  };


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
            <View className="bg-acento py-1 px-1 rounded-full"/>
            <Text className="font-vs-light text-texto1">
              Live
            </Text>
          </View>
          <Text className="font-vs-bold text-acento text-2xl">
            Nombre
          </Text>
          <Pressable className="w-1/12" onPress={() => setOcultar(!showOcultar)}>
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
                {formatBalance(getAmountByCurrency(balanceUSD), showOcultar)}
              </Text>
              <View className="flex-row gap-2">
                  <Text className="text-texto2 font-vs-regular">
                  Pnl Diario
                </Text>
                <Text className="text-acento font-vs-regular">
                  {formatBalance(getAmountByCurrency(pnlUSD), showOcultar)} (+10%)
                </Text>
              </View>
            </View>
            <View>
              <Pressable className="flex-row bg-base2 py-3 px-4 rounded-full mr-5" onPress={() => setOpen(!open)}>
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
        <View className="mx-[10%] flex-row py-10 justify-between">
          <Pressable className="flex-row gap-2 bg-base2 rounded-full px-5 py-3 items-center">
            <Plus height={15} width={15}/>
            <Text className="text-texto1 font-vs-medium">Ingresos</Text>
          </Pressable>
          <Pressable className="flex-row gap-2 bg-base2 rounded-full px-5 py-3 items-center">
            <Menos height={15} width={15}/>
            <Text className="text-texto1 font-vs-medium">Gastos</Text>
          </Pressable>
        </View>
        <View className="flex mb-5 mx-[5%] px-5 py-5 bg-base2 rounded-3xl gap-3">
          <View className="flex-row justify-between px-2 py-3">
            <Text className="text-texto1 font-vs-bold text-xl">
              Ultimos gastos
            </Text>
            <Text className="text-texto2 font-vs-light underline right-3">
              Ver mas
            </Text>
          </View>
          <Gastos />
          <Gastos />
          <Gastos />
          <Gastos />
          <Gastos />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
