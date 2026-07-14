"use client";

import { useEffect, useState } from "react";
import { socialService } from "@/app/clients/socialService";
import type { Notification } from "@/app/components/types/notification";
import type { ProfileUser } from "@/app/components/types/user";
import {
  adaptNotifications,
  hasUnread,
} from "@/app/components/utils/notification/notificationUtils";
import { NOTIFICATION_MESSAGES } from "@/app/components/utils/message/notificationMessage";

export function useNotificationsPage(rawUser: ProfileUser | { user?: ProfileUser | null } | null, showNotification: (message: string, type: "success" | "error") => void) {
  // Desempaquetado seguro del usuario
  const user = rawUser?.user || rawUser;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    // Si no hay ID, apagamos el loader y salimos
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const data = await socialService.getNotifications(user.id);
      const adapted = adaptNotifications(data);

      setNotifications(adapted);

      if (hasUnread(adapted)) {
        await socialService.markNotificationsAsRead(user.id);
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
          }))
        );
      }
    } catch (error) {
      console.error(NOTIFICATION_MESSAGES.ERROR_LOAD, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const acceptFriendRequest = async (notification: Notification) => {
    if (!user?.id || !notification.senderId) {
      showNotification(NOTIFICATION_MESSAGES.PROTOCOL_ERROR, "error");
      return;
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id
          ? {
              ...n,
              aceptada: true,
            }
          : n
      )
    );

    const res = await socialService.acceptRequest(
      notification.senderId,
      user.id
    );

    if (res) {
      showNotification(NOTIFICATION_MESSAGES.ACCEPT_SUCCESS, "success");
    } else {
      showNotification(NOTIFICATION_MESSAGES.ACCEPT_ERROR, "error");
      loadNotifications();
    }
  };

  return {
    notifications,
    loading,
    acceptFriendRequest,
  };
}