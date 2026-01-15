import Close from "@/src/assets/icons/close.svg";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

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

export default function MovimientoModal({
    visible,
    tipo,
    onClose,
    onSave,
    }) {
    const [concepto, setConcepto] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [categoria, setCategoria] = useState("");
    const [metodo, setMetodo] = useState("efectivo");
    useEffect(() => {
        if (!visible) {
            setConcepto("");
            setCantidad("");
            setCategoria("");
            setMetodo("efectivo");
        }
    }, [visible]);
    const handleSave = () => {
        if (!concepto || !cantidad) return;
        onSave({
            id: Date.now().toString(),
            tipo,
            concepto,
            cantidad: Number(cantidad),
            categoria: tipo === "gasto" ? categoria : undefined,
            metodo: tipo === "ingreso" ? metodo : undefined,
            fecha: new Date().toLocaleDateString("es-MX"),
        });
        onClose();
    };
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View className="flex-1 justify-center bg-black/50 items-center">
                <View className="flex gap-5 bg-base2 p-6 pb-9 rounded-3xl w-9/12">
                    <Text className="text-2xl font-vs-medium text-texto1 text-center py-3">
                        {tipo === "ingreso" ? "Nuevo Ingreso" : "Nuevo Gasto"}
                    </Text>
                    <Pressable className="absolute right-6 top-6" onPress={onClose}>
                        <Close width={20} height={20} />
                    </Pressable>
                    <View className="flex-row gap-3">
                        {["efectivo", "tarjeta"].map((m) => (
                            <Pressable
                                key={m}
                                onPress={() => setMetodo(m)}
                                className={`flex-1 py-3 rounded-xl ${
                                    metodo === m ? "bg-acentoClaro" : "bg-base1"
                                }`}
                            >
                                <Text className="text-texto1 text-center capitalize">
                                    {m}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    {tipo === "ingreso" ? (
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
                    ) : (
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
                    <View className="gap-1">
                        <Text className="text-texto2">Cantidad</Text>
                        <TextInput
                            className="bg-base1 rounded-xl px-4 py-3 text-texto1"
                            placeholder="0.00"
                            placeholderTextColor="#FAFAFA"
                            keyboardType="numeric"
                            value={cantidad}
                            onChangeText={(text) => {
                                const cleaned = text.replace(/[^0-9.]/g, "");
                                setCantidad(cleaned);
                            }}
                        />
                    </View>
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
