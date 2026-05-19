"use client";

import { useEffect, useState } from "react";

import { socialService } from "@/service/socialService";

import { NotificationItem } from "@/app/types/profile";

export function useNotifications(userId: number | null, pathname: string) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;

      const data: NotificationItem[] = await socialService.getNotifications(
        userId
      );

      const unread = data?.filter((n) => !n.read && !n.isRead).length || 0;

      setUnreadCount(unread);
    };

    load();
  }, [userId, pathname]);

  return {
    unreadCount,
  };
}
