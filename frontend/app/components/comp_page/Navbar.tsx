"use client";

import Link from "next/link";
import { useUserStore } from "../../store/useUserStore";
import { useRouter } from "next/navigation";
import { Bell, LayoutDashboard } from "lucide-react"; // Añadimos LayoutDashboard
import { useEffect, useState } from "react";
import { socialService } from "@/app/clients/socialService";
import type { ProfileUser } from "@/app/components/types/user";
import type { Notification } from "@/app/components/types/notification";

export default function Navbar() {
  const rawUser = useUserStore((state: { user: ProfileUser | null }) => state.user);
  const logout = useUserStore((state: { logout: () => void }) => state.logout);
  const router = useRouter();

  const user = rawUser?.user || rawUser;
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchUnreadCount = async () => {
      try {
        const notis = await socialService.getNotifications(user.id);
        const unread = notis.filter((n: Notification) => !(n.isRead || n.read)).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error cargando contador", error);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-950 text-white shadow-md border-b border-slate-800">
      <Link href="/" className="text-2xl font-black tracking-tighter hover:text-indigo-400 transition-all">
        MAZANEX
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-slate-400 italic text-sm font-medium hidden sm:block">
              {user.name}
            </span>

            {/* --- Dashboard Link (Gestión de Proyectos) --- */}
            <Link
              href="/pages/dashboard"
              className="p-2 text-slate-400 hover:text-indigo-400 transition-all hover:bg-slate-900 rounded-full"
              title="Gestión de Proyectos"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>

            {/* --- Campanita de Notificaciones --- */}
            <Link
              href="/pages/profile/notifications"
              className="relative p-2 text-slate-400 hover:text-indigo-400 transition-all hover:bg-slate-900 rounded-full"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/pages/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400 hover:opacity-80"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
                  {getInitial(user.name)}
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-600 hover:text-white text-xs font-bold uppercase"
            >
              Salir
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}