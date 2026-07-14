import NotificationCard from "./notificationCard";
import NotificationEmpty from "./notificationEmpty";
import type { Notification } from "@/app/components/types/notification";

interface NotificationListProps {
  notifications: Notification[];
  acceptFriendRequest: (notification: Notification) => void;
}

export default function NotificationList({
  notifications,
  acceptFriendRequest,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification: Notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          acceptFriendRequest={acceptFriendRequest}
        />
      ))}
    </div>
  );
}
