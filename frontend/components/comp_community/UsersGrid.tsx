"use client";

import EmptyState from "./EmptyState";
import UserCard from "./UserCard";

interface Props {
  users: any[];
  relationships: Record<number, any>;
  onAction: (id: number) => void;
}

export default function UsersGrid({
  users,
  relationships,
  onAction,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {users.length === 0 ? (
        <EmptyState />
      ) : (
        users.map((user) => {
          const relationship = relationships[user.id] || {
            status: "NONE",
            isSender: false,
          };

          return (
            <UserCard
              key={user.id}
              user={user}
              relationship={relationship}
              onAction={onAction}
            />
          );
        })
      )}
    </div>
  );
}