import Link from "next/link";

import { Settings2, Gamepad2, ChevronDown } from "lucide-react";

export default function ProfileSidebar({
  menu,
  pathname,
  unreadCount,
  isGamesOpen,
  setIsGamesOpen,
}: any) {
  return (
    <aside className="space-y-8">
      <div className="p-5 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Atajos
        </h3>

        <nav className="flex flex-col gap-2">
          {menu.map((item: any) => {
            if (item.isDropdown) {
              const isActive = item.subItems?.some(
                (sub: any) => pathname === sub.href
              );

              return (
                <div key={item.name} className="flex flex-col gap-1">
                  <button
                    onClick={() => setIsGamesOpen(!isGamesOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive || isGamesOpen
                        ? "bg-indigo-50 text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:bg-white/50"
                    }`}
                  >
                    <span>{item.name}</span>

                    <span className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />

                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isGamesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {isGamesOpen && (
                    <div className="ml-4 pl-3 border-l-2 border-indigo-100/50 flex flex-col gap-1 mt-1">
                      {item.subItems?.map((sub: any) => (
                        <Link key={sub.href} href={sub.href}>
                          <button
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                              pathname === sub.href
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-slate-500 hover:text-indigo-600 hover:bg-white/30"
                            }`}
                          >
                            {sub.name}
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    pathname === item.href
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-500 hover:bg-white/50"
                  }`}
                >
                  <span>{item.name}</span>

                  {item.name === "Notificaciones" && unreadCount > 0 && (
                    <span className="flex items-center justify-center bg-indigo-500 text-white text-[10px] font-black w-5 h-5 rounded-full shadow-lg shadow-indigo-100">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
