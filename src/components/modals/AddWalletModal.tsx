import { isValidSolanaAddress } from "@/src/utils/solscanAPI";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, Text, TextInput, View } from "react-native";

type AddWalletModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (address: string, nickname?: string) => Promise<void>;
  existingWallets: string[]; // Lista de direcciones ya agregadas
  isLoading?: boolean;
};

export default function AddWalletModal({
  visible,
  onClose,
  onSubmit,
  existingWallets,
  isLoading = false,
}: AddWalletModalProps) {
  const [address, setAddress] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Resetear cuando se cierra el modal
  const handleClose = () => {
    if (!submitting) {
      setAddress("");
      setNickname("");
      setSubmitting(false);
      onClose();
    }
  };

  const handleSubmit = async () => {
    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      Alert.alert("Error", "Ingresa una dirección de wallet");
      return;
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      Alert.alert("Error", "La dirección de Solana no es válida");
      return;
    }

    // ✅ VERIFICAR SI YA EXISTE
    if (existingWallets.includes(trimmedAddress)) {
      Alert.alert(
        "Wallet duplicada", 
        "Esta wallet ya está agregada. Usa el botón 'Actualizar' para refrescar sus datos."
      );
      return;
    }

    // Prevenir doble click
    if (submitting) return;

    try {
      setSubmitting(true);
      await onSubmit(trimmedAddress, nickname.trim() || undefined);
      
      // Limpiar y cerrar solo después de éxito
      setAddress("");
      setNickname("");
      onClose();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo obtener la información de la wallet. Verifica la dirección."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-base2 w-11/12 rounded-2xl p-5 gap-4">
          <Text className="text-texto1 text-lg font-vs-medium">
            Añadir Wallet de Solana
          </Text>

          <View className="gap-3">
            <View>
              <Text className="text-texto2 mb-1">Dirección de la wallet</Text>
              <TextInput
                placeholder="Ej. 78jsFoBvdA7sA9NVTgeT5K..."
                placeholderTextColor="#777"
                value={address}
                onChangeText={setAddress}
                className="bg-base1 text-texto1 rounded-xl px-4 py-3"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-texto2 mb-1">
                Apodo (opcional)
              </Text>
              <TextInput
                placeholder="Ej. Mi wallet principal"
                placeholderTextColor="#777"
                value={nickname}
                onChangeText={setNickname}
                className="bg-base1 text-texto1 rounded-xl px-4 py-3"
              />
            </View>
          </View>

          {submitting && (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="#7C3AED" />
              <Text className="text-texto2">
                Obteniendo información de la wallet...
              </Text>
            </View>
          )}

          <View className="flex-row justify-end gap-4 mt-2">
            <Pressable onPress={handleClose} disabled={submitting}>
              <Text className="text-texto2">Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleSubmit} disabled={submitting}>
              <Text className="text-green-400 font-vs-medium">
                {submitting ? "Añadiendo..." : "Añadir"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}