import * as Location from "expo-location";
import { useState } from 'react';

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    const getUserLocation = async () => {
        try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Porfavor activa la ubicacion');
            return;
        }

        let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

        if (coords) {
            const { latitude, longitude } = coords;
            setLatitude(latitude);
            setLongitude(longitude);

            console.log("Lat y Long:", latitude, longitude);
        }
        } catch (error) {
            setErrorMsg("Error obteniendo la ubicación");
            console.log(error);
        }
    };

    return { latitude, longitude, errorMsg, getUserLocation };
};

export default useLocation;
