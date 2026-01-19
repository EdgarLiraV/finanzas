import { CryptoToken } from '../types/financial.types';

// ⚠️ REEMPLAZA ESTO CON TU API KEY DE HELIUS
const HELIUS_API_KEY = '4490e7a5-2c61-4c46-aea8-9be394726e2d'; // ← TU API KEY

/* =========================================================
   💱 TIPO DE CAMBIO USD → MXN
========================================================= */
async function getUsdToMxnRate(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=MXN'
    );
    const data = await res.json();
    return data?.rates?.MXN ?? 20;
  } catch (error) {
    console.error('Error obteniendo tipo de cambio USD→MXN:', error);
    return 20;
  }
}

/* =========================================================
   💰 PRECIO DE TOKEN (Jupiter)
========================================================= */
async function getTokenPrice(tokenMint: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.jup.ag/price/v2?ids=${tokenMint}`
    );
    const data = await response.json();
    return data?.data?.[tokenMint]?.price ?? 0;
  } catch (error) {
    console.error('Error obteniendo precio de token:', error);
    return 0;
  }
}

/* =========================================================
   🪙 OBTENER TOKENS DE WALLET
========================================================= */
export async function getWalletTokens(
  walletAddress: string
): Promise<CryptoToken[]> {
  try {
    console.log('🔍 Wallet:', walletAddress);

    const usdToMxn = await getUsdToMxnRate();
    console.log('💱 USD → MXN:', usdToMxn);

    const tokens: CryptoToken[] = [];

    const heliusUrl = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

    const response = await fetch(heliusUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'balance-request',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: true,
            showNativeBalance: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Helius API error: ${data.error.message}`);
    }

    const assets = data.result?.items ?? [];
    const nativeBalance = data.result?.nativeBalance ?? {};

    /* =========================================================
       🟣 SOL NATIVO (CORREGIDO)
    ========================================================= */
    const solBalance = (nativeBalance.lamports ?? 0) / 1e9;

    if (solBalance > 0) {
      const solPrice = nativeBalance.price_per_sol ?? 0;
      const usdValue = solBalance * solPrice;

      tokens.push({
        symbol: 'SOL',
        amount: solBalance,
        usdValue,
        mxnValue: usdValue * usdToMxn,
      });

      console.log(
        `🟣 SOL → ${solBalance} × $${solPrice} = $${usdValue}`
      );
    }

    /* =========================================================
       🪙 TOKENS FUNGIBLES
    ========================================================= */
    const fungibleTokens = assets.filter(
      (asset: any) =>
        asset.interface === 'FungibleToken' ||
        asset.interface === 'FungibleAsset'
    );

    for (const asset of fungibleTokens) {
      try {
        const tokenInfo = asset.token_info;
        if (!tokenInfo) continue;

        const mint = asset.id;
        const rawAmount = tokenInfo.balance ?? 0;
        const decimals = tokenInfo.decimals ?? 0;
        const symbol =
          tokenInfo.symbol ??
          asset.content?.metadata?.symbol ??
          'UNKNOWN';

        const amount = rawAmount / Math.pow(10, decimals);
        if (amount < 0.000001) continue;

        let usdValue = 0;

        /* ---------- PRIORIDAD 1: Precio unitario Helius ---------- */
        if (tokenInfo.price_info?.price_per_token) {
          usdValue = amount * tokenInfo.price_info.price_per_token;
        }
        /* ---------- PRIORIDAD 2: Stablecoins ---------- */
        else if (symbol === 'USDC' || symbol === 'USDT') {
          usdValue = amount;
        }
        /* ---------- PRIORIDAD 3: Jupiter ---------- */
        else {
          const price = await getTokenPrice(mint);
          if (price > 0) {
            usdValue = amount * price;
          }
        }

        if (usdValue > 0.01) {
          tokens.push({
            symbol,
            amount,
            usdValue,
            mxnValue: usdValue * usdToMxn,
          });

          console.log(
            `🪙 ${symbol} → ${amount} = $${usdValue}`
          );
        }
      } catch (err) {
        console.error('Error procesando token:', err);
      }
    }

    return tokens;
  } catch (error) {
    console.error('💥 Error en getWalletTokens:', error);
    throw error;
  }
}

/* =========================================================
   📊 TOTAL WALLET
========================================================= */
export function calculateWalletValue(tokens: CryptoToken[]): {
  totalUSD: number;
  totalMXN: number;
} {
  const totalUSD = tokens.reduce((sum, t) => sum + t.usdValue, 0);
  const totalMXN = tokens.reduce((sum, t) => sum + t.mxnValue, 0);

  return { totalUSD, totalMXN };
}

/* =========================================================
   ✅ VALIDAR DIRECCIÓN SOLANA
========================================================= */
export function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}
