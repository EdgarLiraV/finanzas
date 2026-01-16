import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type FixBalanceEfectivoModalProps = {
  visible: boolean;
  onClose: () => void;
  totalUSD: number;
  onSubmit: (amount: number) => void;
};

export default function FixBalanceEfectivoModal({
  visible,
  onClose,
  totalUSD,
  onSubmit,
}: FixBalanceEfectivoModalProps) {
  const [amount, setAmount] = useState(totalUSD.toString());

  // Actualizar input si cambia el totalUSD desde afuera
  useEffect(() => {
    setAmount(totalUSD.toString());
  }, [totalUSD, visible]);

  const handleSubmit = () => {
    const value = Number(amount);
    if (isNaN(value)) return;
    onSubmit(value);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-base2 w-80 rounded-2xl p-5 gap-4">
          <Text className="text-texto1 text-lg font-vs-medium mb-2">
            Corregir efectivo
          </Text>

          <TextInput
            placeholder="Monto en efectivo"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="bg-base1 text-texto1 rounded-xl px-4 py-3"
          />

          <View className="flex-row justify-end gap-4 mt-2">
            <Pressable onPress={onClose}>
              <Text className="text-texto2">Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleSubmit}>
              <Text className="text-yellow-400 font-vs-medium">Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
