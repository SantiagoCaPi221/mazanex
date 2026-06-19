import Link from "next/link";

import { UserPlus, Check, ArrowRight } from "lucide-react";

export default function NotificationCard({
  notification,
  acceptFriendRequest,
}: any) {
  const isRead = notification.isRead || notification.read;

  return (
    <div
      className={`group p-4 md:p-5 rounded-3xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
        isRead
          ? "bg-slate-50/50 border-slate-100 opacity-70 hover:opacity-100"
          : "bg-white border-indigo-100 shadow-sm shadow-indigo-100/50 ring-2 ring-indigo-50/50"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl shadow-sm shrink-0 ${
              notification.type === "FRIEND_REQUEST"
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <UserPlus className="w-5 h-5" />
          </div>

          <p className="font-black text-slate-800 uppercase italic tracking-tight text-sm md:text-base leading-snug">
            {notification.message}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {notification.type === "FRIEND_REQUEST" &&
            !isRead &&
            !notification.aceptada && (
              <button
                type="button"
                onClick={() => acceptFriendRequest(notification)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <span className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" />
                  Aceptar
                </span>
              </button>
            )}

          {notification.aceptada && (
            <div className="px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Aceptado
            </div>
          )}

          {notification.senderId && (
            <Link
              href={`/pages/user/${notification.senderId}`}
              className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
