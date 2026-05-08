"use client";
import Link from "next/link";
import { useUserStore } from "../store/useUserStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-950 text-white shadow-md border-b border-slate-800">
      <Link
        href="/"
        className="text-2xl font-black tracking-tighter hover:text-indigo-400 transition-all active:scale-95"
      >
        MAZANEX
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-slate-400 italic text-sm font-medium hidden sm:block">
              {user.nombre}
            </span>

            <Link
              href="/perfil"
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden hover:opacity-80 transition-all border-2 border-indigo-400 shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
                  {getInitial(user.nombre)}
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
              Salir
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
