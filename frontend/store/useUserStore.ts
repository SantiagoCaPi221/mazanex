import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ProfileUser } from "@/app/types/profile";

interface Notification {
  message: string;
  type: "success" | "error";
}

interface UserState {
  user: ProfileUser | null;

  notification: Notification | null;

  setUser: (userData: ProfileUser | null) => void;

  login: (userData: ProfileUser) => void;

  updateUsername: (newName: string) => void;

  logout: () => void;

  showNotification: (message: string, type?: "success" | "error") => void;

  hideNotification: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      notification: null,

      setUser: (userData) =>
        set({
          user: userData,
        }),

      login: (userData) =>
        set({
          user: userData,
        }),

      updateUsername: (newName) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                name: newName,
              }
            : null,
        })),

      logout: () => {
        set({ user: null });

        localStorage.removeItem("user-storage");
      },

      showNotification: (message, type = "success") =>
        set({
          notification: {
            message,
            type,
          },
        }),

      hideNotification: () =>
        set({
          notification: null,
        }),
    }),
    {
      name: "user-storage",

      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
