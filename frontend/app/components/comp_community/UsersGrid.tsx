"use client";

import { Target } from "lucide-react";
import { UserCard } from "./UserCard";
import type { User, Relationship } from "@/app/components/types/community";

type Props = {
  users: User[];
  relationships: Record<number, Relationship>;
  onAction: (id: number) => void;
};

export function UsersGrid({ users, relationships, onAction }: Props) {
  if (users.length === 0) {
    return (
      <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
        <Target className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-30" />
        <p className="text-slate-500 font-black uppercase tracking-widest">
          No se detectan jugadores
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
