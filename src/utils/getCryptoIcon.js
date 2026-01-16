export const CRYPTO_ICONS = {
    SOL: require("../assets/crypto/sol.png"),
    BTC: require("../assets/crypto/btc.png"),
    ETH: require("../assets/crypto/eth.png"),
    USDC: require("../assets/crypto/usdc.png"),
    USDT: require("../assets/crypto/usdt.png"),
    BNB: require("../assets/crypto/bnb.png"),
    XRP: require("../assets/crypto/xrp.png"),
    DOGE: require("../assets/crypto/doge.png"),
    AVAX: require("../assets/crypto/avax.png"),
    TRX: require("../assets/crypto/trx.png"),
    SUI: require("../assets/crypto/sui.png"),
    HYPE: require("../assets/crypto/hype.png"),
  };
  
  const DEFAULT_ICON = require("../assets/crypto/other.png");
  
  export function getCryptoIcon(symbol) {
    if (!symbol) return DEFAULT_ICON;
  
    const normalized = symbol.toUpperCase();
  
    return CRYPTO_ICONS[normalized] ?? DEFAULT_ICON;
  }
  