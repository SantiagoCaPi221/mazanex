"use client";

import { useUserStore } from "@/store/useUserStore";

import { useNotificationsPage } from "@/app/hooks/profile/notification/useNotificationsPage";

import NotificationHeader from "@/components/comp_profile/comp_profile_notification/NotificationHeader";

import NotificationLoader from "@/components/comp_profile/comp_profile_notification/NotificationLoader";

import NotificationList from "@/components/comp_profile/comp_profile_notification/NotificationList";

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
