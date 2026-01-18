export type Metodo = "efectivo" | "tarjeta";

export interface Card {
  id: string;
  name: string;
  balance: number;
}

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

export interface FinancialData {
  cash: number;
  cards: Card[];
  snapshots: Snapshots;
  lastSnapshotDate: string; // Para verificar si ya tomamos snapshot hoy
}