import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    //BLACK

    VisualSansBlack: require('../src/assets/fonts/WFVisualSans-Black.otf'),
    VisualSansBlackDeck: require('../src/assets/fonts/WFVisualSans-BlackDeck.otf'),
    VisualSansBlackDeckItalic: require('../src/assets/fonts/WFVisualSans-BlackDeckItalic.otf'),
    VisualSansBlackItalic: require('../src/assets/fonts/WFVisualSans-BlackItalic.otf'),
    VisualSansBlackText: require('../src/assets/fonts/WFVisualSans-BlackText.otf'),
    VisualSansBlackTextItalic: require('../src/assets/fonts/WFVisualSans-BlackTextItalic.otf'),
    // BOLD

    VisualSansBold: require('../src/assets/fonts/WFVisualSans-Bold.otf'),
    VisualSansBoldDeck: require('../src/assets/fonts/WFVisualSans-BoldDeck.otf'),
    VisualSansBoldDeckItalic: require('../src/assets/fonts/WFVisualSans-BoldDeckItalic.otf'),
    VisualSansBoldItalic: require('../src/assets/fonts/WFVisualSans-BoldItalic.otf'),
    VisualSansBoldText: require('../src/assets/fonts/WFVisualSans-BoldText.otf'),
    VisualSansBoldTextItalic: require('../src/assets/fonts/WFVisualSans-BoldTextItalic.otf'),
    // EXTRA BOLD

    VisualSansExtraBold: require('../src/assets/fonts/WFVisualSans-ExtraBold.otf'),
    VisualSansExtraBoldDeck: require('../src/assets/fonts/WFVisualSans-ExtraBoldDeck.otf'),
    VisualSansExtraBoldDeckItalic: require('../src/assets/fonts/WFVisualSans-ExtraBoldDeckItalic.otf'),
    VisualSansExtraBoldItalic: require('../src/assets/fonts/WFVisualSans-ExtraBoldItalic.otf'),
    VisualSansExtraBoldText: require('../src/assets/fonts/WFVisualSans-ExtraBoldText.otf'),
    VisualSansExtraBoldTextItalic: require('../src/assets/fonts/WFVisualSans-BoldTextItalic.otf'),
  
    // EXTRA LIGHT
    VisualSansExtraLight: require('../src/assets/fonts/WFVisualSans-ExtraLight.otf'),
    VisualSansExtraLightDeck: require('../src/assets/fonts/WFVisualSans-ExtraLightDeck.otf'),
    VisualSansExtraLightDeckItalic: require('../src/assets/fonts/WFVisualSans-ExtraLightDeckItalic.otf'),
    VisualSansExtraLightItalic: require('../src/assets/fonts/WFVisualSans-ExtraLightItalic.otf'),
    VisualSansExtraLightText: require('../src/assets/fonts/WFVisualSans-ExtraLightText.otf'),
    VisualSansExtraLightTextItalic: require('../src/assets/fonts/WFVisualSans-ExtraLightTextItalic.otf'),
  
    // LIGHT
    VisualSansLightItalic: require('../src/assets/fonts/WFVisualSans-LightItalic.otf'),
    VisualSansLightText: require('../src/assets/fonts/WFVisualSans-LightText.otf'),
    VisualSansLightTextItalic: require('../src/assets/fonts/WFVisualSans-LightTextItalic.otf'),
    VisualSansLight: require('../src/assets/fonts/WFVisualSans-Light.otf'),
    VisualSansLightDeck: require('../src/assets/fonts/WFVisualSans-LightDeck.otf'),
    VisualSansLightDeckItalic: require('../src/assets/fonts/WFVisualSans-LightDeckItalic.otf'),
  
    // MEDIUM
    VisualSansMedium: require('../src/assets/fonts/WFVisualSans-Medium.otf'),
    VisualSansMediumDeck: require('../src/assets/fonts/WFVisualSans-MediumDeck.otf'),
    VisualSansMediumDeckItalic: require('../src/assets/fonts/WFVisualSans-MediumDeckItalic.otf'),
    VisualSansMediumItalic: require('../src/assets/fonts/WFVisualSans-MediumItalic.otf'),
    VisualSansMediumText: require('../src/assets/fonts/WFVisualSans-MediumText.otf'),
    VisualSansMediumTextItalic: require('../src/assets/fonts/WFVisualSans-MediumTextItalic.otf'),
  
    // REGULAR
    VisualSansRegular: require('../src/assets/fonts/WFVisualSans-Regular.otf'),
    VisualSansRegularDeck: require('../src/assets/fonts/WFVisualSans-RegularDeck.otf'),
    VisualSansRegularDeckItalic: require('../src/assets/fonts/WFVisualSans-RegularDeckItalic.otf'),
    VisualSansRegularItalic: require('../src/assets/fonts/WFVisualSans-RegularItalic.otf'),
    VisualSansRegularText: require('../src/assets/fonts/WFVisualSans-RegularText.otf'),
    VisualSansRegularTextItalic: require('../src/assets/fonts/WFVisualSans-RegularTextItalic.otf'),
  
    // SEMIBOLD
    VisualSansSemiBold: require('../src/assets/fonts/WFVisualSans-SemiBold.otf'),
    VisualSansSemiBoldDeck: require('../src/assets/fonts/WFVisualSans-SemiBoldDeck.otf'),
    VisualSansSemiBoldDeckItalic: require('../src/assets/fonts/WFVisualSans-SemiBoldDeckItalic.otf'),
    VisualSansSemiBoldItalic: require('../src/assets/fonts/WFVisualSans-SemiBoldItalic.otf'),
    VisualSansSemiBoldText: require('../src/assets/fonts/WFVisualSans-SemiBoldText.otf'),
    VisualSansSemiBoldTextItalic: require('../src/assets/fonts/WFVisualSans-SemiBoldTextItalic.otf'),
  
    // THIN
    VisualSansThin: require('../src/assets/fonts/WFVisualSans-Thin.otf'),
    VisualSansThinDeck: require('../src/assets/fonts/WFVisualSans-ThinDeck.otf'),
    VisualSansThinDeckItalic: require('../src/assets/fonts/WFVisualSans-ThinDeckItalic.otf'),
    VisualSansThinItalic: require('../src/assets/fonts/WFVisualSans-ThinItalic.otf'),
    VisualSansThinText: require('../src/assets/fonts/WFVisualSans-ThinText.otf'),
    VisualSansThinTextItalic: require('../src/assets/fonts/WFVisualSans-ThinTextItalic.otf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
