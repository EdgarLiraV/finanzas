import { CryptoToken } from '../types/financial.types';

// ⚠️ REEMPLAZA ESTO CON TU API KEY DE HELIUS
// Obtén tu key gratis en: https://www.helius.dev/
const HELIUS_API_KEY = '4490e7a5-2c61-4c46-aea8-9be394726e2d'; // ← CÁMBIALA

// Obtener tipo de cambio USD a MXN
async function getUsdToMxnRate(): Promise<number> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=MXN');
    const data = await res.json();
    return data?.rates?.MXN || 20;
  } catch (error) {
    console.error('Error obteniendo tipo de cambio:', error);
    return 20;
  }
}

// Obtener precio de un token usando Jupiter Price API
async function getTokenPrice(tokenMint: string): Promise<number> {
  try {
    const response = await fetch(`https://api.jup.ag/price/v2?ids=${tokenMint}`);
    const data = await response.json();
    return data?.data?.[tokenMint]?.price || 0;
  } catch (error) {
    console.error('Error obteniendo precio de token:', error);
    return 0;
  }
}

// Mint addresses de tokens comunes
const KNOWN_TOKENS: { [key: string]: { symbol: string; decimals: number } } = {
  'So11111111111111111111111111111111111111112': { symbol: 'SOL', decimals: 9 },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', decimals: 6 },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', decimals: 6 },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { symbol: 'mSOL', decimals: 9 },
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': { symbol: 'jitoSOL', decimals: 9 },
};

// Obtener balance de tokens de una wallet usando Helius API
export async function getWalletTokens(walletAddress: string): Promise<CryptoToken[]> {
  try {
    console.log('🔍 Obteniendo tokens para:', walletAddress);
    const usdToMxn = await getUsdToMxnRate();
    console.log('💱 Tipo de cambio USD->MXN:', usdToMxn);

    const tokens: CryptoToken[] = [];

    // Helius RPC endpoint
    const heliusUrl = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    
    console.log('📡 Llamando a Helius API...');

    // 1️⃣ Obtener todos los token accounts usando getAssetsByOwner
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
    console.log('📦 Respuesta de Helius:', JSON.stringify(data, null, 2));

    if (data.error) {
      throw new Error(`Helius API error: ${data.error.message}`);
    }

    const assets = data.result?.items || [];
    const nativeBalance = data.result?.nativeBalance || {};

    console.log(`📋 Assets encontrados: ${assets.length}`);

    // 2️⃣ Procesar SOL nativo
    const solBalance = (nativeBalance.lamports || 0) / 1e9;
    console.log('💰 Balance SOL:', solBalance);

    if (solBalance > 0) {
      // Helius ya nos da el precio de SOL
      const solPrice = nativeBalance.price_per_sol || 0;
      const usdValue = nativeBalance.total_price || (solBalance * solPrice);
      
      console.log('💵 Precio SOL (de Helius):', solPrice);
      console.log('💵 Valor total SOL:', usdValue);
      
      tokens.push({
        symbol: 'SOL',
        amount: solBalance,
        usdValue: usdValue,
        mxnValue: usdValue * usdToMxn,
      });
      console.log('✅ SOL agregado');
    }

    // 3️⃣ Procesar tokens fungibles
    const fungibleTokens = assets.filter((asset: any) => 
      asset.interface === 'FungibleToken' || asset.interface === 'FungibleAsset'
    );

    console.log(`🪙 Tokens fungibles: ${fungibleTokens.length}`);

    for (const asset of fungibleTokens) {
      try {
        const mint = asset.id;
        const tokenAmount = asset.token_info?.balance || 0;
        const decimals = asset.token_info?.decimals || 0;
        const symbol = asset.token_info?.symbol || asset.content?.metadata?.symbol || 'UNKNOWN';
        
        // Convertir a cantidad legible
        const amount = tokenAmount / Math.pow(10, decimals);
        
        console.log(`🔍 Token: ${symbol}, Cantidad: ${amount}`);

        // Filtrar dust
        if (amount < 0.000001) continue;

        // PRIORIDAD 1: Usar precio de Helius (más confiable)
        let usdValue = 0;
        
        if (asset.token_info?.price_info?.total_price) {
          usdValue = asset.token_info.price_info.total_price;
          console.log(`💵 ${symbol} precio de Helius: ${usdValue}`);
        } 
        // PRIORIDAD 2: Para stablecoins
        else if (symbol === 'USDC' || symbol === 'USDT') {
          usdValue = amount;
          console.log(`💵 ${symbol} es stablecoin, valor: ${usdValue}`);
        } 
        // PRIORIDAD 3: Intentar obtener de Jupiter
        else {
          const price = await getTokenPrice(mint);
          if (price > 0) {
            usdValue = amount * price;
            console.log(`💵 ${symbol} precio de Jupiter: ${price}, valor total: ${usdValue}`);
          } else {
            console.log(`⚠️ ${symbol} sin precio disponible, omitiendo...`);
          }
        }

        // Solo agregar si tiene valor mayor a $0.01
        if (usdValue > 0.01) {
          tokens.push({
            symbol: symbol,
            amount: amount,
            usdValue: usdValue,
            mxnValue: usdValue * usdToMxn,
          });
          console.log(`✅ Token agregado: ${symbol}, valor: ${usdValue}`);
        }
      } catch (error) {
        console.error(`Error procesando token:`, error);
        continue;
      }
    }

    console.log('🎉 Total de tokens procesados:', tokens.length);
    return tokens;
  } catch (error) {
    console.error('💥 Error completo en getWalletTokens:', error);
    throw error;
  }
}

// Calcular valor total de una wallet
export function calculateWalletValue(tokens: CryptoToken[]): { totalUSD: number; totalMXN: number } {
  const totalUSD = tokens.reduce((sum, token) => sum + token.usdValue, 0);
  const totalMXN = tokens.reduce((sum, token) => sum + token.mxnValue, 0);
  
  return { totalUSD, totalMXN };
}

// Validar si una dirección de Solana es válida
export function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}