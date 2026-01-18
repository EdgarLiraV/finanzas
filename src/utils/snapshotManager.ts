import { DailySnapshot } from '../types/financial.types';

export const SNAPSHOT_LIMITS = {
  weekly: 7,
  monthly: 31,
  quarterly: 90,
  semiannual: 180,
  annual: 365,
};

export function maintainSnapshots(
  snapshots: DailySnapshot[],
  maxDays: number,
  newSnapshot: DailySnapshot
): DailySnapshot[] {
  // Buscar si ya existe un snapshot para esta fecha
  const existingIndex = snapshots.findIndex(s => s.date === newSnapshot.date);
  
  let updated: DailySnapshot[];
  
  if (existingIndex !== -1) {
    // Actualizar el snapshot existente
    updated = [...snapshots];
    updated[existingIndex] = newSnapshot;
  } else {
    // Agregar nuevo snapshot
    updated = [...snapshots, newSnapshot];
  }
  
  // Ordenar por fecha (más reciente primero)
  updated.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Mantener solo los últimos maxDays
  return updated.slice(0, maxDays);
}

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "2026-01-17"
}

export function shouldTakeSnapshot(lastSnapshotDate: string): boolean {
  return lastSnapshotDate !== getTodayDate();
}