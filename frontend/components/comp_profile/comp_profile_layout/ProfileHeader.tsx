"use client";

import { CheckCircle2 } from "lucide-react";
import { getInitials, getUsername } from "../../../app/utils/profile/layout/profileUtils";

export default function ProfileHeader({ user }: { user: any }) {
  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
        {user.name}
        <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
      </h1>

      <p className="text-slate-500 font-medium text-sm">
        @{getUsername(user.name)}
      </p>

      {user.bio && (
        <p className="mt-3 text-slate-600 text-sm whitespace-pre-wrap">
          {user.bio}
        </p>
      )}
    </div>
  );
}
