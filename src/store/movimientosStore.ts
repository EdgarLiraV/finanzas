import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Movimiento = {
    id: string;
    tipo: "ingreso" | "gasto";
    categoria?: string;
    metodo?: string;
    concepto: string;
    cantidad: number;
    fecha: string;
};

type MovimientosState = {
    movimientos: Movimiento[];
    addMovimiento: (mov: Movimiento) => void;
    clearMovimientos: () => void;
};

export const useMovimientosStore = create<MovimientosState>()(
    persist(
        (set) => ({
            movimientos: [],
        addMovimiento: (mov) =>
            set((state) => ({
                movimientos: [mov, ...state.movimientos],
            })),
        clearMovimientos: () => set({ movimientos: [] }),
        }),
        {
            name: "movimientos-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
