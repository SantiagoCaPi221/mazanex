import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Notification {
  message: string;
  type: "success" | "error";
}

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
}

interface UserState {
  user: User | null;
  notification: { message: string; type: "success" | "error" } | null; //estado alerta
  setUser: (userData: User | null) => void;
  login: (userData: User) => void;
  updateUsername: (newName: string) => void;
  logout: () => void;
  showNotification: (message: string, type?: "success" | "error") => void;
  hideNotification: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      notification: null, //estado inicial
      setUser: (userData) => set({ user: userData }),
      login: (userData) => set({ user: userData }),
      updateUsername: (newName) =>
        set((state) => ({
          user: state.user ? { ...state.user, nombre: newName } : null,
        })),
      logout: () => {
        set({ user: null });
        localStorage.removeItem("user-storage");
      },
      showNotification: (message, type = "success") =>
        set({ notification: { message, type } }),
      hideNotification: () => set({ notification: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
