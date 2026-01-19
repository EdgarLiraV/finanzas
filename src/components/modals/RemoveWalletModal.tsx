import { CryptoWallet } from "@/src/types/financial.types";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type RemoveWalletModalProps = {
  visible: boolean;
  onClose: () => void;
  wallets: CryptoWallet[];
  onRemove: (walletId: string) => void;
};

export default function RemoveWalletModal({
  visible,
  onClose,
  wallets,
  onRemove,
}: RemoveWalletModalProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-base2 w-80 rounded-2xl p-5 max-h-[70%]">
          <Text className="text-texto1 text-lg font-vs-medium mb-4">
            Eliminar Wallet
          </Text>

          {wallets.length === 0 ? (
            <View className="py-8">
              <Text className="text-texto2 text-center">
                No tienes wallets registradas
              </Text>
            </View>
          ) : (
            <ScrollView className="mb-4">
              {wallets.map((wallet) => (
                <Pressable
                  key={wallet.id}
                  onPress={() => {
                    onRemove(wallet.id);
                    onClose();
                  }}
                  className="bg-base1 rounded-xl p-4 mb-3"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      {wallet.nickname && (
                        <Text className="text-texto1 font-vs-medium mb-1">
                          {wallet.nickname}
                        </Text>
                      )}
                      <Text className="text-texto2 text-sm">
                        {formatAddress(wallet.address)}
                      </Text>
                      <Text className="text-acento text-sm mt-1">
                        ${wallet.totalMXN.toLocaleString()} MXN
                      </Text>
                    </View>
                    <Text className="text-red-400 ml-3">Eliminar</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Pressable onPress={onClose}>
            <Text className="text-texto2 text-center mt-3">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}