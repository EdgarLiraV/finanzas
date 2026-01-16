import ArrowRight from "@/src/assets/icons/arrow-right.svg"; // 👉 flecha simple
import Beca from "@/src/assets/icons/beca.svg";
import Quincena from "@/src/assets/icons/card.svg";
import Deposito from "@/src/assets/icons/deposito.svg";
import Fijo from "@/src/assets/icons/fijo.svg";
import Comida from "@/src/assets/icons/hamburuesa.svg";
import Sueldo from "@/src/assets/icons/Money.svg";
import Oscio from "@/src/assets/icons/oscio.svg";
import Otro from "@/src/assets/icons/other.svg";
import Rendimientos from "@/src/assets/icons/rendimiento.svg";
import Salud from "@/src/assets/icons/salud.svg";
import Transfer from "@/src/assets/icons/transfer.svg";
import { Text, View } from "react-native";

const ICONOS = {
    Deposito,
    Sueldo,
    Quincena,
    Beca,
    Rendimientos,
    Otro,

    Fijo,
    Comida,
    Salud,
    Oscio,
};

export default function MovimientoItem({ movimiento }) {
    const esGasto = movimiento.tipo === "gasto";
    const esIngreso = movimiento.tipo === "ingreso";
    const esTransferencia = movimiento.tipo === "transferencia";
    const Icono = esTransferencia
        ? Transfer
        : ICONOS[movimiento.concepto] || Sueldo;

    return (
        <View className="flex-row bg-base1 rounded-3xl justify-between px-5 py-3 items-center">
            <View className="flex-row items-center gap-3">
                <View className="bg-base2 items-center rounded-full p-3">
                    <Icono width={24} height={24} />
                </View>
                <View>
                    <Text className="text-texto1 font-vs-medium">
                        {esTransferencia
                            ? "Transferencia"
                            : movimiento.concepto
                        }
                    </Text>
                    {esTransferencia ? (
                        <View className="flex-row items-center gap-2">
                            <Text className="text-texto2 capitalize">
                                {movimiento.desde}
                            </Text>
                            <ArrowRight width={14} height={14} />
                            <Text className="text-texto2 capitalize">
                                {movimiento.hacia}
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-texto1 font-vs-light">
                            {movimiento.fecha}
                        </Text>
                    )}
                </View>
            </View>
            <Text
                className={`font-vs-medium ${
                esGasto
                    ? "text-perdida"
                    : esIngreso
                    ? "text-acento"
                    : "text-texto2"
                }`}
            >
                {esGasto && "-"}
                {esIngreso && "+"}
                ${movimiento.cantidad.toFixed(2)}
            </Text>
        </View>
    );
}
