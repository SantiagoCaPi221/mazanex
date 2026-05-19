import { Notification } from "@/app/types/notification";

export function adaptNotifications(notifications: Notification[]) {
  return notifications.map((n) => ({
    ...n,
    isRead: n.isRead || n.read || false,
  }));
}

export function hasUnread(notifications: Notification[]) {
  return notifications.some((n) => !n.isRead);
}
