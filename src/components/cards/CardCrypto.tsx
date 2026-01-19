import { CryptoToken } from "@/src/types/financial.types";
import { getCryptoIcon } from "@/src/utils/getCryptoIcon";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    LayoutAnimation,
    Platform,
    Pressable,
    Text,
    UIManager,
    View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TokenDistribution = {
  symbol: string;
  percent: number;
  mxn: number;
};

type CardCryptoProps = {
  totalMXN: number;
  tokens: CryptoToken[];
  onAddWallet: () => void;
  onRemoveWallet: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export default function CardCrypto({
  totalMXN,
  tokens,
  onAddWallet,
  onRemoveWallet,
  onRefresh,
  isRefreshing = false,
}: CardCryptoProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Calcular distribución por token
  const distribution: TokenDistribution[] = tokens.map((token) => ({
    symbol: token.symbol,
    mxn: token.mxnValue,
    percent: totalMXN > 0 ? Math.round((token.mxnValue / totalMXN) * 100) : 0,
  }));

  // Ordenar por valor descendente
  distribution.sort((a, b) => b.mxn - a.mxn);

  // Preview: Top 3 + "OTRAS" si hay más
  const previewDistribution = distribution.slice(0, 3);
  if (distribution.length > 3) {
    const otrasTotal = distribution.slice(3).reduce((sum, t) => sum + t.mxn, 0);
    const otrasPercent = totalMXN > 0 ? Math.round((otrasTotal / totalMXN) * 100) : 0;
    previewDistribution.push({
      symbol: "OTRAS",
      mxn: otrasTotal,
      percent: otrasPercent,
    });
  }

  const dataToRender = expanded ? distribution : previewDistribution;

  return (
    <View className="flex bg-base2 rounded-2xl p-5">
      {/* HEADER */}
      <View className="flex mb-5 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-vs-medium text-texto2 text-lg">Crypto</Text>
          {isRefreshing && <ActivityIndicator size="small" color="#7C3AED" />}
        </View>
        <Text className="font-vs-bold text-texto1 text-3xl">
          ${totalMXN.toLocaleString()}
        </Text>
      </View>

      {/* DISTRIBUCIÓN */}
      {dataToRender.length > 0 ? (
        <Pressable onPress={toggleExpand}>
          {dataToRender.map((item) => (
            <View
              key={item.symbol}
              className="flex-row justify-between items-center mb-4"
            >
              {/* ICONO + SYMBOL */}
              <View className="flex-row items-center gap-3">
                <Image
                  source={getCryptoIcon(item.symbol)}
                  className="w-7 h-7 rounded-full"
                  resizeMode="contain"
                />
                <Text className="text-texto1 font-vs-regular">
                  {item.symbol}
                </Text>
              </View>

              {/* VALOR */}
              <Text className="text-texto1 font-vs-regular">
                {item.percent}% · ${item.mxn.toLocaleString()}
              </Text>
            </View>
          ))}

          {/* FOOTER - Solo si hay tokens */}
          {distribution.length > 3 && (
            <View className="mt-2">
              <Text className="font-vs-light text-texto2">
                {expanded ? "Mostrar menos" : "Mostrar más"}
              </Text>
            </View>
          )}
        </Pressable>
      ) : (
        <View className="py-4">
          <Text className="text-texto2 text-center">
            No tienes crypto registrado
          </Text>
          <Text className="text-texto2 text-center text-sm mt-1">
            Añade una wallet para comenzar
          </Text>
        </View>
      )}

      {/* BOTONES */}
      <View className="flex-row justify-between mt-4 pt-4 border-t border-base1">
        <Pressable onPress={onAddWallet}>
          <Text className="text-green-400 font-vs-medium">+ Añadir</Text>
        </Pressable>

        <Pressable onPress={onRemoveWallet}>
          <Text className="text-red-400 font-vs-medium">Eliminar</Text>
        </Pressable>

        <Pressable onPress={onRefresh} disabled={isRefreshing}>
          <Text className="text-acento font-vs-medium">
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}