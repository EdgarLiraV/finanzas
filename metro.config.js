const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Config base de Expo
const config = getDefaultConfig(__dirname);

// ======= CONFIGURAR SVG TRANSFORMER =======
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// Quitar svg de assetExts y agregarlo a sourceExts
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);

config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "svg",
];

// Exportar config final integrada con NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
