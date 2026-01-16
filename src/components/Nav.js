import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import CuentasIcon from "@/src/assets/icons/cuentas.svg";
import HomeIcon from "@/src/assets/icons/home.svg";
import PerfilIcon from "@/src/assets/icons/usuario.svg";

export default function Nav({screenActual = "home"}) {
    const router = useRouter();
    const irA = (ruta) => {
        if(screenActual === ruta) {
            return;
        }
        router.replace(`/(tabs)/${ruta}`);
    };

    return (
        <View className="flex-row items-center gap-10 rounded-full bg-[#222222] py-5 px-10">

            <Pressable onPress={() => irA("home")}>
                <HomeIcon width={30} height={30} />
            </Pressable>

            <Pressable onPress={() => irA("cuentas")}>
                <CuentasIcon width={30} height={30} />
            </Pressable>

            <Pressable onPress={() => irA("perfil")}>
                <PerfilIcon width={30} height={30} />
            </Pressable>

        </View>
    );
}
