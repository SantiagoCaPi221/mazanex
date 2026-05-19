import Link from "next/link";
import { UserPlus, Users, Clock, XCircle } from "lucide-react";
import { UserAvatar } from "./UserAvatar";

import type { Relationship, User } from "@/app/types/community";

type Props = {
  user: User;
  relationship: Relationship;
  onAction: (id: number) => void;
};

export function UserCard({ user, relationship, onAction }: Props) {
  return (
    <div className="flex items-center justify-between p-4">
      <Link href={`/user/${user.id}`} className="flex items-center gap-3">
        <UserAvatar
          src={user.avatarUrl}
          name={user.name}
          className="w-12 h-12 rounded-xl"
        />

        <span className="font-bold">{user.name}</span>
      </Link>

      <button onClick={() => onAction(user.id)}>
        {relationship.status === "ACCEPTED" ? (
          <Users />
        ) : relationship.status === "PENDING" ? (
          <Clock />
        ) : (
          <UserPlus />
        )}

        {relationship.status === "ACCEPTED" && <XCircle />}
      </button>
    </div>
  );
}
