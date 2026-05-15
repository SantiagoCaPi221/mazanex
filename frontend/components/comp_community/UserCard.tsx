"use client";

import Link from "next/link";
import { Clock, UserPlus, Users, XCircle } from "lucide-react";
import UserAvatar from "./AvatarUser";

interface Props {
  user: any;
  relationship: any;
  onAction: (id: number) => void;
}

export default function UserCard({ user, relationship, onAction }: Props) {
  const getButtonStyle = () => {
    if (relationship.status === "ACCEPTED") {
      return "bg-emerald-500/10 text-emerald-500 hover:bg-rose-500/20 hover:text-rose-500";
    }

    if (relationship.status === "PENDING") {
      return "bg-amber-500/10 text-amber-500 hover:bg-rose-500/20 hover:text-rose-500";
    }

    return "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-500";
  };

  const renderIcon = () => {
    if (relationship.status === "ACCEPTED") {
      return <Users className="w-5 h-5 group-hover/btn:hidden" />;
    }

    if (relationship.status === "PENDING") {
      return <Clock className="w-5 h-5 group-hover/btn:hidden" />;
    }

    return <UserPlus className="w-5 h-5" />;
  };

  return (
    <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-[2.5rem] p-6 transition-all duration-500 flex items-center justify-between backdrop-blur-sm">
      <Link
        href={`/user/${user.id}`}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        <UserAvatar
          src={user.avatarUrl}
          name={user.name}
          className="w-14 h-14 rounded-2xl shrink-0 group-hover:scale-105 transition-transform"
        />

        <div className="truncate">
          <h3 className="font-black text-white uppercase italic truncate">
            {user.name}
          </h3>

          <p className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-widest">
            {relationship.status === "ACCEPTED" ? "Friend" : "Private profile"}
          </p>
        </div>
      </Link>

      <button
        onClick={() => onAction(user.id)}
        className={`group/btn p-4 rounded-2xl transition-all active:scale-90 ${getButtonStyle()}`}
      >
        {renderIcon()}

        {(relationship.status === "ACCEPTED" ||
          (relationship.status === "PENDING" && relationship.isSender)) && (
          <XCircle className="w-5 h-5 hidden group-hover/btn:block" />
        )}
      </button>
    </div>
  );
}
