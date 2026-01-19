export type Metodo = "efectivo" | "tarjeta";

export interface Card {
  id: string;
  name: string;
  balance: number;
}

// ========== CRYPTO TYPES ==========
export interface CryptoToken {
  symbol: string;
  amount: number;
  usdValue: number;
  mxnValue: number;
}

export interface CryptoWallet {
  id: string;
  address: string;
  nickname?: string;
  tokens: CryptoToken[];
  totalUSD: number;
  totalMXN: number;
  lastUpdated: string;
}

// ========== SNAPSHOTS ==========
export interface DailySnapshot {
  date: string; // "2026-01-17"
  totalBalance: number;
}

export interface Snapshots {
  weekly: DailySnapshot[];
  monthly: DailySnapshot[];
  quarterly: DailySnapshot[];
  semiannual: DailySnapshot[];
  annual: DailySnapshot[];
}

// ========== MAIN DATA STRUCTURE ==========
export interface FinancialData {
  cash: number;
  cards: Card[];
  cryptoWallets: CryptoWallet[];
  snapshots: Snapshots;
  lastSnapshotDate: string;
}