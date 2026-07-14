import type { ProfileUser, StoreUser } from "./user";
import type { Notification } from "./notification";

export interface UserState {
  user: StoreUser;
  setUser: (user: StoreUser) => void;
  login: (user: StoreUser) => void;
  logout: () => void;
  updateUser: (data: Partial<ProfileUser>) => void;
  notification: Notification | null;
  showNotification: (message: string, type?: "success" | "error") => void;
  hideNotification: () => void;
}
