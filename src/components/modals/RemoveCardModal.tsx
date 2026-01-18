import { Card } from "@/src/types/financial.types";
import { Modal, Pressable, Text, View } from "react-native";

type RemoveCardModalProps = {
  visible: boolean;
  onClose: () => void;
  cards: Card[];
  onRemove: (id: string) => void;
};

export default function RemoveCardModal({
  visible,
  onClose,
  cards,
  onRemove,
}: RemoveCardModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-base2 w-80 rounded-2xl p-5 gap-4">
          <Text className="text-texto1 text-lg font-vs-medium">
            Eliminar tarjeta
          </Text>

          {cards.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => {
                onRemove(card.id);
                onClose();
              }}
            >
              <Text className="text-red-400 py-2">{card.name}</Text>
            </Pressable>
          ))}

          <Pressable onPress={onClose}>
            <Text className="text-texto2 mt-3">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}