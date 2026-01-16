import { getCryptoIcon } from "@/src/utils/getCryptoIcon";
import { useState } from "react";
import {
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

export default function CardCrypto({
    totalUSD,
    previewDistribution,
    fullDistribution,
}) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const dataToRender = expanded ? fullDistribution : previewDistribution;

    return (
        <Pressable onPress={toggleExpand} activeOpacity={0.9}>
            <View className="flex bg-base2 rounded-2xl p-5">
                {/* HEADER */}
                <View className="flex mb-5 gap-2">
                    <Text className="font-vs-medium text-texto2 text-lg">
                        Crypto
                    </Text>
                    <Text className="font-vs-bold text-texto1 text-3xl">
                        ${totalUSD.toLocaleString()}
                    </Text>
                </View>

                {/* DISTRIBUCIÓN */}
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
                            {item.percent}% · ${item.usd.toLocaleString()}
                        </Text>
                    </View>
                ))}

                {/* FOOTER */}
                <View className="mt-2">
                    <Text className="font-vs-light text-texto2">
                        {expanded ? "Mostrar menos" : "Mostrar más"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
