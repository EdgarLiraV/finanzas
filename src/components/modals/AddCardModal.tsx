import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type AddCardModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export default function AddCardModal({
  visible,
  onClose,
  onSubmit,
}: AddCardModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim()); // ✅ TS sabe que es string
    setName("");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-base2 w-80 rounded-2xl p-5 gap-4">
          <Text className="text-texto1 text-lg font-vs-medium">Añadir tarjeta</Text>
          <TextInput
            placeholder="Ej. Revolut"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
            className="bg-base1 text-texto1 rounded-xl px-4 py-3"
          />
          <View className="flex-row justify-end gap-4">
            <Pressable onPress={onClose}>
              <Text className="text-texto2">Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleSubmit}>
              <Text className="text-green-400 font-vs-medium">Añadir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
