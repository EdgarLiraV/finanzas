import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Card, CryptoWallet, DailySnapshot, FinancialData, Metodo, Snapshots } from '../types/financial.types';
import { getTodayDate, maintainSnapshots, shouldTakeSnapshot, SNAPSHOT_LIMITS } from '../utils/snapshotManager';
import { calculateWalletValue, getWalletTokens } from '../utils/solscanAPI';

const STORAGE_KEY = '@financial_data';

const initialData: FinancialData = {
  cash: 0,
  cards: [],
  cryptoWallets: [],
  snapshots: {
    weekly: [],
    monthly: [],
    quarterly: [],
    semiannual: [],
    annual: [],
  },
  lastSnapshotDate: '',
};

interface FinancialContextType {
  // Getters
  getTotalBalance: () => number;
  getCashBalance: () => number;
  getCardsBalance: () => number;
  getCryptoBalance: () => number;
  getCardById: (id: string) => Card | undefined;
  getAllCards: () => Card[];
  getAllWallets: () => CryptoWallet[];
  getWalletById: (id: string) => CryptoWallet | undefined;
  getDistribution: () => { cash: number; cards: number; crypto: number };
  getSnapshots: (period: keyof Snapshots) => DailySnapshot[];
  getDailyPnL: () => number;
  
  // Setters - Movimientos
  addMoney: (amount: number, type: Metodo, cardId?: string) => void;
  subtractMoney: (amount: number, type: Metodo, cardId?: string) => void;
  transfer: (amount: number, from: Metodo, to: Metodo, fromCardId?: string, toCardId?: string) => void;
  
  // Gestión de Tarjetas
  addCard: (name: string, initialBalance: number) => void;
  removeCard: (cardId: string) => void;
  fixCardBalance: (cardId: string, newBalance: number) => void;
  fixCashBalance: (newBalance: number) => void;
  
  // Gestión de Crypto Wallets
  addWallet: (address: string, nickname?: string) => Promise<void>;
  removeWallet: (walletId: string) => void;
  refreshWallet: (walletId: string) => Promise<void>;
  refreshAllWallets: () => Promise<void>;
  
  // Snapshots
  takeSnapshot: () => void;
  
  // Estado
  isLoading: boolean;
  isRefreshingCrypto: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FinancialData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingCrypto, setIsRefreshingCrypto] = useState(false);

  // Cargar datos al inicio
  useEffect(() => {
    loadData();
  }, []);

  // Guardar datos cada vez que cambien
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [data]);

  // Verificar si necesitamos tomar snapshot diario
  useEffect(() => {
    if (!isLoading && shouldTakeSnapshot(data.lastSnapshotDate)) {
      takeSnapshot();
    }
  }, [isLoading]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        // MIGRACIÓN: Agregar cryptoWallets si no existe
        if (!parsedData.cryptoWallets) {
          parsedData.cryptoWallets = [];
        }
        
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving financial data:', error);
    }
  };

  // ==================== GETTERS ====================
  
  const getTotalBalance = (): number => {
    const cardsTotal = data.cards.reduce((sum, card) => sum + card.balance, 0);
    const cryptoTotal = data.cryptoWallets.reduce((sum, wallet) => sum + wallet.totalMXN, 0);
    return data.cash + cardsTotal + cryptoTotal;
  };

  const getCashBalance = (): number => {
    return data.cash;
  };

  const getCardsBalance = (): number => {
    return data.cards.reduce((sum, card) => sum + card.balance, 0);
  };

  const getCryptoBalance = (): number => {
    return data.cryptoWallets.reduce((sum, wallet) => sum + wallet.totalMXN, 0);
  };

  const getCardById = (id: string): Card | undefined => {
    return data.cards.find(card => card.id === id);
  };

  const getAllCards = (): Card[] => {
    return data.cards;
  };

  const getAllWallets = (): CryptoWallet[] => {
    return data.cryptoWallets;
  };

  const getWalletById = (id: string): CryptoWallet | undefined => {
    return data.cryptoWallets.find(wallet => wallet.id === id);
  };

  const getDistribution = () => {
    const total = getTotalBalance();
    if (total === 0) return { cash: 0, cards: 0, crypto: 0 };
    
    return {
      cash: (data.cash / total) * 100,
      cards: (getCardsBalance() / total) * 100,
      crypto: (getCryptoBalance() / total) * 100,
    };
  };

  const getSnapshots = (period: keyof Snapshots): DailySnapshot[] => {
    return data.snapshots[period];
  };

  const getDailyPnL = (): number => {
    const todayBalance = getTotalBalance();
    const yesterdaySnapshot = data.snapshots.weekly[1]; // El segundo más reciente
    
    if (!yesterdaySnapshot) return 0;
    
    return todayBalance - yesterdaySnapshot.totalBalance;
  };

  // ==================== SETTERS ====================
  
  const addMoney = (amount: number, type: Metodo, cardId?: string) => {
    if (amount <= 0) return;

    setData(prev => {
      if (type === 'efectivo') {
        return { ...prev, cash: prev.cash + amount };
      } else {
        // Para tarjeta, SIEMPRE necesitamos un cardId
        if (!cardId) return prev;

        const cardExists = prev.cards.some(c => c.id === cardId);
        if (!cardExists) return prev;

        return {
          ...prev,
          cards: prev.cards.map(card =>
            card.id === cardId
              ? { ...card, balance: card.balance + amount }
              : card
          ),
        };
      }
    });
  };

  const subtractMoney = (amount: number, type: Metodo, cardId?: string) => {
    if (amount <= 0) return;

    setData(prev => {
      if (type === 'efectivo') {
        if (prev.cash < amount) return prev;
        return { ...prev, cash: prev.cash - amount };
      } else {
        // Para tarjeta, SIEMPRE necesitamos un cardId
        if (!cardId) return prev;

        const card = prev.cards.find(c => c.id === cardId);
        if (!card) return prev;
        if (card.balance < amount) return prev;

        return {
          ...prev,
          cards: prev.cards.map(c =>
            c.id === cardId
              ? { ...c, balance: c.balance - amount }
              : c
          ),
        };
      }
    });
  };

  const transfer = (amount: number, from: Metodo, to: Metodo, fromCardId?: string, toCardId?: string) => {
    if (amount <= 0) return;
    if (from === to) return;

    setData(prev => {
      // Validar fondos suficientes en el origen
      if (from === 'efectivo') {
        if (prev.cash < amount) return prev;
      } else {
        // from === 'tarjeta'
        if (!fromCardId) return prev;
        
        const fromCard = prev.cards.find(c => c.id === fromCardId);
        if (!fromCard) return prev;
        if (fromCard.balance < amount) return prev;
      }

      // Validar que existe la tarjeta de destino si es necesario
      if (to === 'tarjeta') {
        if (!toCardId) return prev;
        
        const toCard = prev.cards.find(c => c.id === toCardId);
        if (!toCard) return prev;
      }

      // Realizar transferencia
      let newData = { ...prev };

      // Restar del origen
      if (from === 'efectivo') {
        newData.cash -= amount;
      } else {
        newData.cards = newData.cards.map(c =>
          c.id === fromCardId
            ? { ...c, balance: c.balance - amount }
            : c
        );
      }

      // Sumar al destino
      if (to === 'efectivo') {
        newData.cash += amount;
      } else {
        newData.cards = newData.cards.map(c =>
          c.id === toCardId
            ? { ...c, balance: c.balance + amount }
            : c
        );
      }

      return newData;
    });
  };

  // ==================== GESTIÓN DE TARJETAS ====================
  
  const addCard = (name: string, initialBalance: number) => {
    const newCard: Card = {
      id: Date.now().toString(),
      name,
      balance: initialBalance,
    };

    setData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
  };

  const removeCard = (cardId: string) => {
    setData(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== cardId),
    }));
  };

  const fixCardBalance = (cardId: string, newBalance: number) => {
    setData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, balance: newBalance }
          : card
      ),
    }));
  };

  const fixCashBalance = (newBalance: number) => {
    setData(prev => ({
      ...prev,
      cash: newBalance,
    }));
  };

  // ==================== GESTIÓN DE CRYPTO WALLETS ====================
  
  const addWallet = async (address: string, nickname?: string) => {
    try {
      setIsRefreshingCrypto(true);
      
      // Obtener tokens de la wallet
      const tokens = await getWalletTokens(address);
      const { totalUSD, totalMXN } = calculateWalletValue(tokens);

      const newWallet: CryptoWallet = {
        id: Date.now().toString(),
        address,
        nickname,
        tokens,
        totalUSD,
        totalMXN,
        lastUpdated: new Date().toISOString(),
      };

      setData(prev => ({
        ...prev,
        cryptoWallets: [...prev.cryptoWallets, newWallet],
      }));
    } catch (error) {
      console.error('Error adding wallet:', error);
      throw error;
    } finally {
      setIsRefreshingCrypto(false);
    }
  };

  const removeWallet = (walletId: string) => {
    setData(prev => ({
      ...prev,
      cryptoWallets: prev.cryptoWallets.filter(wallet => wallet.id !== walletId),
    }));
  };

  const refreshWallet = async (walletId: string) => {
    try {
      setIsRefreshingCrypto(true);
      
      const wallet = data.cryptoWallets.find(w => w.id === walletId);
      if (!wallet) return;

      const tokens = await getWalletTokens(wallet.address);
      const { totalUSD, totalMXN } = calculateWalletValue(tokens);

      setData(prev => ({
        ...prev,
        cryptoWallets: prev.cryptoWallets.map(w =>
          w.id === walletId
            ? {
                ...w,
                tokens,
                totalUSD,
                totalMXN,
                lastUpdated: new Date().toISOString(),
              }
            : w
        ),
      }));
    } catch (error) {
      console.error('Error refreshing wallet:', error);
      throw error;
    } finally {
      setIsRefreshingCrypto(false);
    }
  };

  const refreshAllWallets = async () => {
    try {
      setIsRefreshingCrypto(true);
      
      const updatedWallets = await Promise.all(
        data.cryptoWallets.map(async (wallet) => {
          try {
            const tokens = await getWalletTokens(wallet.address);
            const { totalUSD, totalMXN } = calculateWalletValue(tokens);
            
            return {
              ...wallet,
              tokens,
              totalUSD,
              totalMXN,
              lastUpdated: new Date().toISOString(),
            };
          } catch (error) {
            console.error(`Error refreshing wallet ${wallet.address}:`, error);
            return wallet; // Mantener datos anteriores si falla
          }
        })
      );

      setData(prev => ({
        ...prev,
        cryptoWallets: updatedWallets,
      }));
    } catch (error) {
      console.error('Error refreshing all wallets:', error);
    } finally {
      setIsRefreshingCrypto(false);
    }
  };

  // ==================== SNAPSHOTS ====================
  
  const takeSnapshot = () => {
    const today = getTodayDate();
    const totalBalance = getTotalBalance();

    const newSnapshot: DailySnapshot = {
      date: today,
      totalBalance,
    };

    setData(prev => ({
      ...prev,
      snapshots: {
        weekly: maintainSnapshots(prev.snapshots.weekly, SNAPSHOT_LIMITS.weekly, newSnapshot),
        monthly: maintainSnapshots(prev.snapshots.monthly, SNAPSHOT_LIMITS.monthly, newSnapshot),
        quarterly: maintainSnapshots(prev.snapshots.quarterly, SNAPSHOT_LIMITS.quarterly, newSnapshot),
        semiannual: maintainSnapshots(prev.snapshots.semiannual, SNAPSHOT_LIMITS.semiannual, newSnapshot),
        annual: maintainSnapshots(prev.snapshots.annual, SNAPSHOT_LIMITS.annual, newSnapshot),
      },
      lastSnapshotDate: today,
    }));
  };

  return (
    <FinancialContext.Provider
      value={{
        getTotalBalance,
        getCashBalance,
        getCardsBalance,
        getCryptoBalance,
        getCardById,
        getAllCards,
        getAllWallets,
        getWalletById,
        getDistribution,
        getSnapshots,
        getDailyPnL,
        addMoney,
        subtractMoney,
        transfer,
        addCard,
        removeCard,
        fixCardBalance,
        fixCashBalance,
        addWallet,
        removeWallet,
        refreshWallet,
        refreshAllWallets,
        takeSnapshot,
        isLoading,
        isRefreshingCrypto,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial debe usarse dentro de FinancialProvider');
  }
  return context;
}