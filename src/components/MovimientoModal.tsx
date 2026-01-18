import Arrow from "@/src/assets/icons/arrow-right.svg";
import Close from "@/src/assets/icons/close.svg";
import { useFinancial } from "@/src/contexts/FinanciialContext";
import { Card } from "@/src/types/financial.types";
import { useEffect, useState } from "react";
import { Alert, Animated, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

const CONCEPTOS_INGRESO = [
  "Deposito",
  "Sueldo",
  "Quincena",
  "Beca",
  "Rendimientos",
  "Otro",
];

const CATEGORIAS_GASTO = [
  "Fijo",
  "Comida",
  "Salud",
  "Oscio",
  "Otro",
];

type Metodo = "efectivo" | "tarjeta";

type Movimiento = {
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

type MovimientoModalProps = {
  visible: boolean;
  tipo: Movimiento["tipo"];
  onClose: () => void;
  onSave: (mov: Movimiento) => void;
};

export default function MovimientoModal({
  visible,
  tipo,
  onClose,
  onSave,
}: MovimientoModalProps) {
  const { 
    addMoney, 
    subtractMoney, 
    transfer, 
    getAllCards,
    getCashBalance,
    getCardById
  } = useFinancial();
  const cards = getAllCards();

  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [metodo, setMetodo] = useState<"efectivo" | "tarjeta">("efectivo");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Selector de tarjeta abierto/cerrado
  const [showCardSelector, setShowCardSelector] = useState(false);

  // Resetear al abrir/cerrar modal
  useEffect(() => {
    if (!visible) {
      setConcepto("");
      setCantidad("");
      setCategoria("");
      setMetodo("efectivo");
      setSelectedCardId(null);
      setShowCardSelector(false);
    }
  }, [visible]);

  // Auto-seleccionar primera tarjeta si existe
  useEffect(() => {
    if (metodo === "tarjeta" && cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
  }, [metodo, cards]);

  const handleSave = () => {
    if (!cantidad) {
      Alert.alert("Error", "Ingresa una cantidad válida");
      return;
    }
  
    const cantidadNum = Number(cantidad);

    if (cantidadNum <= 0) {
      Alert.alert("Error", "La cantidad debe ser mayor a 0");
      return;
    }

    if (tipo === "transferencia") {
      // ========== TRANSFERENCIA ==========
      const from = metodo === "efectivo" ? "efectivo" : "tarjeta";
      const to = metodo === "efectivo" ? "tarjeta" : "efectivo";

      // Validar que haya tarjeta seleccionada
      if (!selectedCardId && (from === "tarjeta" || to === "tarjeta")) {
        Alert.alert("Error", "Selecciona una tarjeta para transferir");
        return;
      }

      // Validar fondos suficientes
      if (from === "efectivo") {
        const cashBalance = getCashBalance();
        if (cashBalance < cantidadNum) {
          Alert.alert(
            "Fondos insuficientes", 
            `No tienes suficiente efectivo. Disponible: $${cashBalance.toFixed(2)}`
          );
          return;
        }
      } else {
        // from === "tarjeta"
        const card = getCardById(selectedCardId!);
        if (!card || card.balance < cantidadNum) {
          Alert.alert(
            "Fondos insuficientes",
            `No tienes suficiente saldo en ${card?.name || "esta tarjeta"}. Disponible: $${card?.balance.toFixed(2) || 0}`
          );
          return;
        }
      }

      // Realizar transferencia
      transfer(
        cantidadNum,
        from,
        to,
        from === "tarjeta" ? selectedCardId || undefined : undefined,
        to === "tarjeta" ? selectedCardId || undefined : undefined
      );

      onSave({
        id: Date.now().toString(),
        tipo: "transferencia",
        concepto: "Transferencia",
        cantidad: cantidadNum,
        desde: from,
        hacia: to,
        fecha: new Date().toLocaleDateString("es-MX"),
      });
    } else if (tipo === "ingreso") {
      // ========== INGRESO ==========
      if (!concepto) {
        Alert.alert("Error", "Selecciona un concepto");
        return;
      }

      if (metodo === "tarjeta" && !selectedCardId) {
        Alert.alert("Error", "Selecciona una tarjeta");
        return;
      }

      addMoney(cantidadNum, metodo, selectedCardId || undefined);

      onSave({
        id: Date.now().toString(),
        tipo: "ingreso",
        concepto,
        cantidad: cantidadNum,
        metodo,
        fecha: new Date().toLocaleDateString("es-MX"),
      });
    } else if (tipo === "gasto") {
      // ========== GASTO ==========
      if (!concepto) {
        Alert.alert("Error", "Selecciona una categoría");
        return;
      }

      if (metodo === "tarjeta" && !selectedCardId) {
        Alert.alert("Error", "Selecciona una tarjeta");
        return;
      }

      // Validar fondos suficientes
      if (metodo === "efectivo") {
        const cashBalance = getCashBalance();
        if (cashBalance < cantidadNum) {
          Alert.alert(
            "Fondos insuficientes",
            `No tienes suficiente efectivo. Disponible: $${cashBalance.toFixed(2)}`
          );
          return;
        }
      } else {
        const card = getCardById(selectedCardId!);
        if (!card || card.balance < cantidadNum) {
          Alert.alert(
            "Fondos insuficientes",
            `No tienes suficiente saldo en ${card?.name || "esta tarjeta"}. Disponible: $${card?.balance.toFixed(2) || 0}`
          );
          return;
        }
      }

      subtractMoney(cantidadNum, metodo, selectedCardId || undefined);

      onSave({
        id: Date.now().toString(),
        tipo: "gasto",
        concepto,
        cantidad: cantidadNum,
        categoria,
        metodo,
        fecha: new Date().toLocaleDateString("es-MX"),
      });
    }
  
    onClose();
  };

  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: metodo === "tarjeta" ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [metodo]);
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const selectedCard = cards.find(c => c.id === selectedCardId);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 justify-center bg-black/50 items-center">
        <View className="flex gap-5 bg-base2 p-6 pb-9 rounded-3xl w-9/12 max-h-[80%]">

          {/* TÍTULO */}
          <Text className="text-2xl font-vs-medium text-texto1 text-center py-3">
            {tipo === "ingreso"
              ? "Nuevo Ingreso"
              : tipo === "gasto"
              ? "Nuevo Gasto"
              : "Transferencia"}
          </Text>

          <Pressable className="absolute right-6 top-6" onPress={onClose}>
            <Close width={20} height={20} />
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5">
              {/* MÉTODO / TRANSFERENCIA */}
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => setMetodo("efectivo")}
                  className={`flex-1 py-3 rounded-xl ${
                    metodo === "efectivo" ? "bg-acentoClaro" : "bg-base1"
                  }`}
                >
                  <Text className="text-texto1 text-center">Efectivo</Text>
                </Pressable>

                {tipo === "transferencia" && (
                  <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <Arrow width={18} height={18} />
                  </Animated.View>
                )}

                <Pressable
                  onPress={() => setMetodo("tarjeta")}
                  className={`flex-1 py-3 rounded-xl ${
                    metodo === "tarjeta" ? "bg-acentoClaro" : "bg-base1"
                  }`}
                >
                  <Text className="text-texto1 text-center">Tarjeta</Text>
                </Pressable>
              </View>

              {/* SELECTOR DE TARJETA */}
              {/* Mostrar cuando: 
                  1. metodo === "tarjeta" (tarjeta es origen o destino según el tipo)
                  2. tipo === "transferencia" && metodo === "efectivo" (tarjeta es destino)
              */}
              {((metodo === "tarjeta" || tipo === "transferencia") && cards.length > 0) && (
                <View className="gap-2">
                  <Text className="text-texto2">
                    {tipo === "transferencia" 
                      ? (metodo === "efectivo" ? "Hacia tarjeta" : "Desde tarjeta")
                      : "Tarjeta"}
                  </Text>
                  <Pressable
                    onPress={() => setShowCardSelector(!showCardSelector)}
                    className="bg-base1 rounded-xl px-4 py-3 flex-row justify-between items-center"
                  >
                    <View>
                      <Text className="text-texto1">
                        {selectedCard?.name || "Selecciona una tarjeta"}
                      </Text>
                      {selectedCard && (
                        <Text className="text-texto2 text-xs mt-1">
                          Disponible: ${selectedCard.balance.toFixed(2)}
                        </Text>
                      )}
                    </View>
                    <Text className="text-texto2">▼</Text>
                  </Pressable>

                  {showCardSelector && (
                    <View className="bg-base1 rounded-xl overflow-hidden">
                      {cards.map((card: Card) => (
                        <Pressable
                          key={card.id}
                          onPress={() => {
                            setSelectedCardId(card.id);
                            setShowCardSelector(false);
                          }}
                          className={`px-4 py-3 ${
                            selectedCardId === card.id ? "bg-acentoClaro" : ""
                          }`}
                        >
                          <Text className="text-texto1">{card.name}</Text>
                          <Text className="text-texto2 text-xs">
                            Disponible: ${card.balance.toFixed(2)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Mensaje si no hay tarjetas (solo mostrar cuando sea relevante) */}
              {((metodo === "tarjeta" || tipo === "transferencia") && cards.length === 0) && (
                <View className="bg-base1 rounded-xl px-4 py-3">
                  <Text className="text-texto2 text-center">
                    No tienes tarjetas. Agrega una primero.
                  </Text>
                </View>
              )}

              {/* INGRESO */}
              {tipo === "ingreso" && (
                <View className="gap-2">
                  <Text className="text-texto2">Concepto</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {CONCEPTOS_INGRESO.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => setConcepto(item)}
                        className={`px-4 py-2 rounded-full ${
                          concepto === item ? "bg-acentoClaro" : "bg-base1"
                        }`}
                      >
                        <Text className="text-texto1">{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* GASTO */}
              {tipo === "gasto" && (
                <View className="gap-2">
                  <Text className="text-texto2">Categoría</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {CATEGORIAS_GASTO.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => {
                          setCategoria(item);
                          setConcepto(item);
                        }}
                        className={`px-4 py-2 rounded-full ${
                          categoria === item ? "bg-acentoClaro" : "bg-base1"
                        }`}
                      >
                        <Text className="text-texto1 capitalize">{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* CANTIDAD (común a todos) */}
              <View className="gap-1">
                <Text className="text-texto2">Cantidad</Text>
                <TextInput
                  className="bg-base1 rounded-xl px-4 py-3 text-texto1"
                  placeholder="0.00"
                  placeholderTextColor="#FAFAFA"
                  keyboardType="numeric"
                  value={cantidad}
                  onChangeText={(text) =>
                    setCantidad(text.replace(/[^0-9.]/g, ""))
                  }
                />
              </View>

              {/* GUARDAR */}
              <Pressable
                onPress={handleSave}
                className="py-4 rounded-xl bg-acentoClaro mt-2"
              >
                <Text className="text-center text-texto1 font-vs-medium">
                  Guardar
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}