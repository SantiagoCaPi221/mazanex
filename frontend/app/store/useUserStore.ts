import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "@/app/components/types/userStore";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      notification: null,

      setUser: (user) => set({ user }),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      showNotification: (message, type = "success") =>
        set({ notification: { id: Date.now(), message, type } }),

      hideNotification: () => set({ notification: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
