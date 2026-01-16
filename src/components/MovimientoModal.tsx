import Arrow from "@/src/assets/icons/arrow-right.svg"; // usa cualquier flecha que tengas
import Close from "@/src/assets/icons/close.svg";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, Text, TextInput, View } from "react-native";

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
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [metodo, setMetodo] = useState<"efectivo" | "tarjeta">("efectivo");

  useEffect(() => {
    if (!visible) {
      setConcepto("");
      setCantidad("");
      setCategoria("");
      setMetodo("efectivo");
    }
  }, [visible]);

  const handleSave = () => {
    if (!cantidad) return;
  
    if (tipo === "transferencia") {
      onSave({
        id: Date.now().toString(),
        tipo: "transferencia",
        concepto: "Transferencia",
        cantidad: Number(cantidad),
        desde: metodo === "efectivo" ? "efectivo" : "tarjeta",
        hacia: metodo === "efectivo" ? "tarjeta" : "efectivo",
        fecha: new Date().toLocaleDateString("es-MX"),
      });
    } else {
      if (!concepto) return;
  
      onSave({
        id: Date.now().toString(),
        tipo,
        concepto,
        cantidad: Number(cantidad),
        categoria: tipo === "gasto" ? categoria : undefined,
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
  

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 justify-center bg-black/50 items-center">
        <View className="flex gap-5 bg-base2 p-6 pb-9 rounded-3xl w-9/12">

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
            className="py-4 rounded-xl bg-acentoClaro"
          >
            <Text className="text-center text-texto1 font-vs-medium">
              Guardar
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}
