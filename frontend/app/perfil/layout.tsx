"use client";

import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Settings2, CheckCircle2, Camera, User, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { perfilService } from "@/service/perfilService";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, showNotification } = useUserStore();
  const pathname = usePathname();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpload = async (file: File, type: "avatarUrl" | "bannerUrl") => {
    if (file.size > 1024 * 1024) {
      showNotification("La imagen es demasiado pesada (Máx 1MB)", "error");
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const data = await perfilService.actualizarPerfil(user.id, {
        id: user.id,
        [type]: reader.result as string,
      });
      if (data) {
        setUser(data);
        const tipoLabel = type === "avatarUrl" ? "Foto de perfil" : "Banner";
        showNotification(`¡${tipoLabel} actualizado con éxito!`, "success");
      } else {
        showNotification("No se pudo subir la imagen", "error");
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const menu = [
    { name: "Perfil General", href: "/perfil" },
    { name: "Seguridad", href: "/perfil/security" },
    { name: "Mazanex Snake", href: "/perfil/snake" },
    { name: "KOF 2002", href: "/perfil/kof" },
    { name: "Bloody Roar 2", href: "/perfil/bloody" },
    { name: "Super Smash Bros", href: "/perfil/smash" }, // <--- NUEVO ATAJO N64
    { name: "Notificaciones", href: "/perfil/notifications" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-12 mb-12 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div
          className="h-56 bg-slate-200 w-full relative group cursor-pointer overflow-hidden"
          onClick={() => bannerInputRef.current?.click()}
        >
          {user.bannerUrl ? (
            <img
              src={user.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center">
              <span className="text-white/20 font-black text-4xl italic">
                MAZANEX
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
            <ImageIcon className="w-5 h-5" /> Cambiar Banner
          </div>
          <input
            type="file"
            ref={bannerInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleUpload(e.target.files[0], "bannerUrl")
            }
          />
        </div>

        <div className="pt-20 pb-12 px-12 relative">
          <div className="absolute -top-16 left-12">
            <div
              className="w-36 h-36 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-8 border-white cursor-pointer group relative overflow-hidden"
              onClick={() => avatarInputRef.current?.click()}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-4xl font-black text-indigo-600 uppercase">
                  {user.nombre?.substring(0, 2)}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleUpload(e.target.files[0], "avatarUrl")
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
            <aside className="space-y-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {user.nombre}{" "}
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                  @{user.nombre?.toLowerCase()}
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Atajos
                </h3>
                <nav className="space-y-2">
                  {menu.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          pathname === item.href
                            ? "bg-white text-indigo-600 shadow-md"
                            : "text-slate-500 hover:bg-white/50"
                        }`}
                      >
                        {item.name}
                      </button>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="min-h-[300px]">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
