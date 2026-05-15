import { UserCard } from "./UserCard";

import type { User, Relationship } from "@/app/types/community";

type Props = {
  users: User[];
  relationships: Record<number, Relationship>;
  onAction: (id: number) => void;
};

export function UsersGrid({ users, relationships, onAction }: Props) {
  if (!users.length) {
    return (
      <div className="text-center py-10 opacity-50">
        No se detectan jugadores
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {users.map((u) => (
        <UserCard
          key={u.id}
          user={u}
          relationship={relationships[u.id]}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
