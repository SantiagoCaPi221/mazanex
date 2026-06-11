"use client";

import { useUserStore } from "@/app/store/useUserStore";

import { useNotificationsPage } from "@/app/components/hooks/profile/notification/useNotification";

import NotificationHeader from "@/app/components/comp_notification/notificationHeader";

import NotificationLoader from "@/app/components/comp_notification/notificationLoader";

import NotificationList from "@/app/components/comp_notification/notificationList";

export default function NotificationsPage() {
  const { user, showNotification } = useUserStore();

  const { notifications, loading, acceptFriendRequest } = useNotificationsPage(
    user,
    showNotification
  );

  if (loading) {
    return <NotificationLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto animate-in fade-in duration-500 pb-16">
      <NotificationHeader />

      <NotificationList
        notifications={notifications}
        acceptFriendRequest={acceptFriendRequest}
      />
    </div>
  );
}
