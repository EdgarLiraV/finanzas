/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}",  "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "vs-black": ["VisualSansBlack"],
        "vs-blackdeck": ["VisualSansBlackDeck"],
        "vs-blackdeckItalic": ["VisualSansBlackDeckItalic"],
        "vs-blackItalic": ["VisualSansBlackItalic"],
        "vs-blacktext": ["VisualSansBlackText"],
        "vs-blacktext-italic": ["VisualSansBlackTextItalic"],

        "vs-bold": ["VisualSansBold"],
        "vs-bolddeck": ["VisualSansBoldDeck"],
        "vs-bolddeck-italic": ["VisualSansBoldDeckItalic"],
        "vs-bold-italic": ["VisualSansBoldItalic"],
        "vs-boldText": ["VisualSansBoldTextc"],
        "vs-boldtext-italic": ["VisualSansBoldTextItalic"],

        "vs-extrabold": ["VisualSansExtraBold"],
        "vs-extrabolddeck": ["VisualSansExtraBoldDeck"],
        "vs-extrabolddeck-italic": ["VisualSansExtraBoldDeckItalic"],
        "vs-extrabold-italic": ["VisualSansExtraBoldItalic"],
        "vs-extraboldtext": ["VisualSansExtraBoldText"],
        "vs-extraboldtext-italic": ["VisualSansExtraBoldTextItalic"],
      
        // EXTRA LIGHT
        "vs-extralight": ["VisualSansExtraLight"],
        "vs-extralightdeck": ["VisualSansExtraLightDeck"],
        "vs-extralightdeck-italic": ["VisualSansExtraLightDeckItalic"],
        "vs-extralight-italic": ["VisualSansExtraLightItalic"],
        "vs-extralighttext": ["VisualSansExtraLightText"],
        "vs-extralighttext-italic": ["VisualSansExtraLightTextItalic"],
      
        // LIGHT
        "vs-light-italic": ["VisualSansLightItalic"],
        "vs-lighttext": ["VisualSansLightText"],
        "vs-lighttext-italic": ["VisualSansLightTextItalic"],
        "vs-light": ["VisualSansLight"],
        "vs-lightdeck": ["VisualSansLightDeck"],
        "vs-lightdeck-italic": ["VisualSansLightDeckItalic"],
      
        // MEDIUM
        "vs-medium": ["VisualSansMedium"],
        "vs-mediumdeck": ["VisualSansMediumDeck"],
        "vs-mediumdeck-italic": ["VisualSansMediumDeckItalic"],
        "vs-medium-italic": ["VisualSansMediumItalic"],
        "vs-mediumtext": ["VisualSansMediumText"],
        "vs-mediumtext-italic": ["VisualSansMediumTextItalic"],
      
        // REGULAR
        "vs-regular": ["VisualSansRegular"],
        "vs-regulardeck": ["VisualSansRegularDeck"],
        "vs-regulardeck-italic": ["VisualSansRegularDeckItalic"],
        "vs-regular-italic": ["VisualSansRegularItalic"],
        "vs-regulartext": ["VisualSansRegularText"],
        "vs-regulartext-italic": ["VisualSansRegularTextItalic"],
      
        // SEMIBOLD
        "vs-semibold": ["VisualSansSemiBold"],
        "vs-semibolddeck": ["VisualSansSemiBoldDeck"],
        "vs-semibolddeck-italic": ["VisualSansSemiBoldDeckItalic"],
        "vs-semibold-italic": ["VisualSansSemiBoldItalic"],
        "vs-semiboldtext": ["VisualSansSemiBoldText"],
        "vs-semiboldtext-italic": ["VisualSansSemiBoldTextItalic"],
      
        // THIN
        "vs-thin": ["VisualSansThin"],
        "vs-thindeck": ["VisualSansThinDeck"],
        "vs-thindeck-italic": ["VisualSansThinDeckItalic"],
        "vs-thin-italic": ["VisualSansThinItalic"],
        "vs-thintext": ["VisualSansThinText"],
        "vs-thintext-italic": ["VisualSansThinTextItalic"],
      },
      colors: {
        PrimarioOscuro: "#509090",
        Primario: "#5EBBB5",
        Blanco: "#FFFFFF",
        Negro: "#2B2A29",
        GrisOscuro: "#535353",
        GrisClaro: "#CCCCCC",
        GrisClarisimo: "#E4E4E4",
        Fondo: "#EDF0F2",
        Consulta: "#E5F2FF",
      },
    },
  },
  plugins: [],
}