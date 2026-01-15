import Beca from "@/src/assets/icons/beca.svg"
import Quincena from "@/src/assets/icons/card.svg"
import Deposito from "@/src/assets/icons/deposito.svg"
import Fijo from "@/src/assets/icons/fijo.svg"
import Comida from "@/src/assets/icons/hamburuesa.svg"
import Sueldo from "@/src/assets/icons/Money.svg"
import Oscio from "@/src/assets/icons/oscio.svg"
import Otro from "@/src/assets/icons/other.svg"
import Rendimientos from "@/src/assets/icons/rendimiento.svg"
import Salud from "@/src/assets/icons/salud.svg"
import { Text, View } from "react-native"

const ICONOS = {
    Deposito: Deposito,
    Sueldo: Sueldo,
    Quincena: Quincena,
    Beca: Beca,
    Rendimientos: Rendimientos,
    Otro: Otro,

    Fijo: Fijo,
    Comida: Comida,
    Salud: Salud,
    Oscio: Oscio,
    Otro: Otro,
};

export default function MovimientoItem({ movimiento }) {
    const Icono = ICONOS[movimiento.concepto] || Sueldo;
    const esGasto = movimiento.tipo === "gasto";

    return (
        <View className="flex-row bg-base1 rounded-3xl justify-between px-5 py-3 items-center">
            <View className="flex-row items-center gap-3">
                <View className="bg-base2 items-center rounded-full p-3">
                    <Icono width={25} height={25} />
                </View>
                <View>
                    <Text className="text-texto1 font-vs-medium">
                        {movimiento.concepto}
                    </Text>
                    <Text className="text-texto1 font-vs-light">
                        {movimiento.fecha}
                    </Text>
                </View>
            </View>
            <Text
                className={`font-vs-medium ${
                esGasto ? "text-perdida" : "text-acento"
                }`}
            >
                {esGasto ? "-" : "+"}${movimiento.cantidad.toFixed(2)}
            </Text>
        </View>
    );
}
