import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserStore = {
  userId: string | null;
  isHydrated: boolean;

  setUserId: (id: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      isHydrated: false,

      setUserId: (id) => set({ userId: id }),
      clearUser: () => set({ userId: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        useUserStore.setState({
          isHydrated: true,
          userId: state?.userId ?? null,
        });
      },
    }
  )
);