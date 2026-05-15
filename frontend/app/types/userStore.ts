import { User } from "./user";
import { Notification } from "./notification";

export interface UserState {
  user: User | null;

  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;

  updateUser: (data: Partial<User>) => void;

  notification: Notification | null;

  showNotification: (message: string, type?: "success" | "error") => void;
  hideNotification: () => void;
}
