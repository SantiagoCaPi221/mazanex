import NotificationCard from "./NotificationCard";
import NotificationEmpty from "./NotificationEmpty";

export default function NotificationList({
  notifications,
  acceptFriendRequest,
}: any) {
  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification: any) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          acceptFriendRequest={acceptFriendRequest}
        />
      ))}
    </div>
  );
}
