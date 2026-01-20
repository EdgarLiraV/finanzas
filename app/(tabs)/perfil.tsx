import Nav from "@/src/components/Nav";
import { useFinancial } from "@/src/contexts/FinanciialContext";
import { useUserStore } from "@/src/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil() {
  const clearUser = useUserStore((s) => s.clearUser);
  const { 
    getTotalBalance, 
    getAllCards, 
    getAllWallets,
    refreshAllWallets,
    isRefreshingCrypto 
  } = useFinancial();

  const totalBalance = getTotalBalance();
  const cards = getAllCards();
  const wallets = getAllWallets();

  // Estados de configuración (puedes guardar esto en AsyncStorage después)
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(true);
  const [actualizacionAuto, setActualizacionAuto] = useState(false);

  // Cerrar sesión
  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro? Se borrarán todos tus datos locales.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              // Limpiar todo el AsyncStorage
              await AsyncStorage.clear();
              // Limpiar stores
              clearUser();
              // Redirigir a inicio
              router.replace("/(inicio)/etapa1");
            } catch (error) {
              console.error("Error cerrando sesión:", error);
              Alert.alert("Error", "No se pudo cerrar sesión");
            }
          },
        },
      ]
    );
  };

  // Limpiar datos financieros (sin cerrar sesión)
  const handleClearFinancialData = () => {
    Alert.alert(
      "Limpiar datos financieros",
      "Esto eliminará todas tus cuentas, tarjetas, wallets y snapshots. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@financial_data");
              Alert.alert("Listo", "Datos financieros eliminados. Reinicia la app.");
            } catch (error) {
              console.error("Error limpiando datos:", error);
            }
          },
        },
      ]
    );
  };

  // Exportar datos (para backup)
  const handleExportData = async () => {
    try {
      const data = await AsyncStorage.getItem("@financial_data");
      if (data) {
        console.log("📦 Datos exportados:", data);
        Alert.alert(
          "Datos exportados",
          "Los datos se han copiado a los logs. En una versión futura podrás compartirlos.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Sin datos", "No hay datos para exportar");
      }
    } catch (error) {
      console.error("Error exportando datos:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-base1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="bg-base1"
      >
        {/* HEADER */}
        <View className="flex flex-row items-center justify-center py-6 px-[5%] bg-base2">
          <Text className="font-vs-bold text-texto1 text-2xl">
            Configuración
          </Text>
        </View>

        <View className="px-[5%] py-5 gap-6">
          {/* RESUMEN DE CUENTA */}
          <View className="bg-base2 rounded-2xl p-5">
            <Text className="text-texto2 font-vs-medium mb-3">
              Resumen de cuenta
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-texto2">Balance total</Text>
                <Text className="text-texto1 font-vs-semibold">
                  ${totalBalance.toLocaleString()} MXN
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-texto2">Tarjetas registradas</Text>
                <Text className="text-texto1">{cards.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-texto2">Wallets crypto</Text>
                <Text className="text-texto1">{wallets.length}</Text>
              </View>
            </View>
          </View>

          {/* CONFIGURACIÓN DE CRYPTO */}
          <View className="bg-base2 rounded-2xl p-5">
            <Text className="text-texto2 font-vs-medium mb-3">
              Gestión de Crypto
            </Text>
            <Pressable
              onPress={refreshAllWallets}
              disabled={isRefreshingCrypto}
              className="bg-acento py-3 rounded-xl mb-3"
            >
              <Text className="text-texto1 text-center font-vs-medium">
                {isRefreshingCrypto 
                  ? "Actualizando wallets..." 
                  : "🔄 Actualizar todas las wallets"}
              </Text>
            </Pressable>
            <Text className="text-texto2 text-xs">
              Actualiza los balances de todas tus wallets de Solana
            </Text>
          </View>

          {/* PREFERENCIAS */}
          <View className="bg-base2 rounded-2xl p-5">
            <Text className="text-texto2 font-vs-medium mb-3">
              Preferencias
            </Text>
            
            <View className="gap-4">
              {/* Notificaciones */}
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-texto1">Notificaciones</Text>
                  <Text className="text-texto2 text-xs">
                    Alertas de cambios importantes
                  </Text>
                </View>
                <Switch
                  value={notificaciones}
                  onValueChange={setNotificaciones}
                  trackColor={{ false: "#52525B", true: "#7C3AED" }}
                  thumbColor="#fff"
                />
              </View>

              {/* Modo oscuro */}
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-texto1">Modo oscuro</Text>
                  <Text className="text-texto2 text-xs">
                    Actualmente activado por defecto
                  </Text>
                </View>
                <Switch
                  value={modoOscuro}
                  onValueChange={setModoOscuro}
                  trackColor={{ false: "#52525B", true: "#7C3AED" }}
                  thumbColor="#fff"
                />
              </View>

              {/* Actualización automática de crypto */}
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-texto1">Actualización automática</Text>
                  <Text className="text-texto2 text-xs">
                    Actualizar crypto al abrir la app
                  </Text>
                </View>
                <Switch
                  value={actualizacionAuto}
                  onValueChange={setActualizacionAuto}
                  trackColor={{ false: "#52525B", true: "#7C3AED" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>

          {/* DATOS Y PRIVACIDAD */}
          <View className="bg-base2 rounded-2xl p-5">
            <Text className="text-texto2 font-vs-medium mb-3">
              Datos y privacidad
            </Text>
            
            <Pressable
              onPress={handleExportData}
              className="py-3 mb-2"
            >
              <Text className="text-acento font-vs-medium">
                📤 Exportar mis datos
              </Text>
            </Pressable>

            <Pressable
              onPress={handleClearFinancialData}
              className="py-3"
            >
              <Text className="text-yellow-400 font-vs-medium">
                🗑️ Limpiar datos financieros
              </Text>
            </Pressable>
          </View>

          {/* INFORMACIÓN */}
          <View className="bg-base2 rounded-2xl p-5">
            <Text className="text-texto2 font-vs-medium mb-3">
              Información
            </Text>
            <View className="gap-2">
              <Text className="text-texto2 text-sm">Versión de la app: 1.0.0</Text>
              <Text className="text-texto2 text-sm">
                Última actualización: Enero 2026
              </Text>
            </View>
          </View>

          {/* CERRAR SESIÓN */}
          <Pressable
            onPress={handleLogout}
            className="bg-red-500/20 border border-red-500 rounded-2xl p-4 mb-28"
          >
            <Text className="text-red-400 text-center font-vs-bold text-lg">
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 w-screen items-center">
        <Nav screenActual="perfil" />
      </View>
    </SafeAreaView>
  );
}