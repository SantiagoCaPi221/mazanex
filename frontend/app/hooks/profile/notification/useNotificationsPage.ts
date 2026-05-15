"use client";

import { useEffect, useState } from "react";

import { socialService } from "@/service/socialService";

import { Notification } from "@/app/types/notification";

import {
  adaptNotifications,
  hasUnread,
} from "@/app/utils/profile/notification/notificationUtils";

import { NOTIFICATION_MESSAGES } from "@/app/utils/message/notificationMessages";

export function useNotificationsPage(user: any, showNotification: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.id) return;

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
