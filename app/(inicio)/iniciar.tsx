import Eye from "@/src/assets/icons/eye.svg";
import EyeClose from "@/src/assets/icons/eyeclose.svg";
import Lock from "@/src/assets/icons/lock.svg";
import User from "@/src/assets/icons/user.svg";
import Card from "@/src/assets/images/card.svg";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Inicio() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const setUserId = useUserStore((state) => state.setUserId);
    const Crear = () => {
        router.replace("/registro");
    };
    const Entrar = () => {
        setUserId("user_demo_123");
        router.replace("../(tabs)/home")
    }
    return (
        <SafeAreaView className="flex-1 bg-base1">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 items-center px-[10%] pt-16">
                        <Card width={200} height={200}/>
                        <Text className="text-texto1 text-4xl font-vs-bold mt-20">Bienvenido</Text>
                        <View className="w-full py-10 gap-5 items-center">
                            <View className="flex flex-row border border-texto1 w-full rounded-xl py-2 px-5 items-center gap-5">
                                <User width={20} height={20} />
                                <TextInput
                                    placeholderTextColor="#FAFAFA"
                                    placeholder="Usuario"
                                />
                            </View>
                            <View className="flex flex-row border border-texto1 w-full rounded-xl py-2 px-5 items-center">
                                <View className="w-1/12">
                                    <Lock width={20} height={20} />
                                </View>
                                <View className="w-10/12 pl-5">
                                    <TextInput
                                        placeholderTextColor="#FAFAFA"
                                        placeholder="Contraseña"
                                        className="text-texto1"
                                        secureTextEntry={!showPassword}
                                    />
                                </View>
                                <Pressable className="w-1/12" onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <Eye width={20} height={20} />
                                ) : (
                                    <EyeClose width={20} height={20} />
                                )}
                                </Pressable>
                            </View>
                            <Pressable 
                                onPress={Entrar}
                                className="bg-acento rounded-full py-5 items-center mt-5 w-full"
                            >
                                <Text className="text-white font-vs-medium text-xl">
                                    Entrar
                                </Text>
                            </Pressable>
                            <View className="flex-row gap-2">
                                <Text className="text-texto2 font-vs-lighttext">No tienes cuenta?</Text>
                                <Text className="text-blue-400 font-vs-lighttext underline" onPress={Crear}>Crear cuenta</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
