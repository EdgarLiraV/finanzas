import { Card } from "@/src/types/financial.types";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

type FixBalanceModalProps = {
  visible: boolean;
  onClose: () => void;
  cards: Card[];
  onSubmit: (updatedCards: { id: string; usd: number }[]) => void;
};

export default function FixBalanceModal({
  visible,
  onClose,
  cards,
  onSubmit,
}: FixBalanceModalProps) {
  // Mantener estado individual por tarjeta
  const [amounts, setAmounts] = useState<{ [id: string]: string }>({});

  // Inicializar valores con los balance actuales
  useEffect(() => {
    const init: { [id: string]: string } = {};
    cards.forEach((c) => {
      init[c.id] = c.balance.toString();
    });
    setAmounts(init);
  }, [cards, visible]);

  const handleChange = (id: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const updated = cards.map((c) => ({
      id: c.id,
      usd: Number(amounts[c.id]) || 0,
    }));
    onSubmit(updated);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-base2 w-80 rounded-2xl p-5 max-h-[80%]">
          <Text className="text-texto1 text-lg font-vs-medium mb-3">
            Corregir saldo de tarjetas
          </Text>

          <ScrollView className="mb-4">
            {cards.map((card) => (
              <View key={card.id} className="mb-3">
                <Text className="text-texto2 mb-1">{card.name}</Text>
                <TextInput
                  placeholder={`Monto para ${card.name}`}
                  placeholderTextColor="#777"
                  keyboardType="numeric"
                  value={amounts[card.id]}
                  onChangeText={(val) => handleChange(card.id, val)}
                  className="bg-base1 text-texto1 rounded-xl px-4 py-3"
                />
              </View>
            ))}
          </ScrollView>

          <View className="flex-row justify-end gap-4">
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