"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { socialService } from "@/service/socialService";
import {
  Bell,
  UserPlus,
  Check,
  Clock,
  ShieldCheck,
  Ghost,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function NotificacionesPage() {
  const { user, showNotification } = useUserStore();
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarNotificaciones = async () => {
    if (!user?.id) return;
    try {
      const data = await socialService.getNotifications(user.id);

      // Aseguramos de que el frontend entienda el formato booleano de Java (n.read o n.isRead)
      const notisAdaptadas = data.map((n: any) => ({
        ...n,
        isRead: n.isRead || n.read || false,
      }));

      setNotificaciones(notisAdaptadas);

      if (notisAdaptadas.some((n: any) => !n.isRead)) {
        await socialService.markNotificationsAsRead(user.id);
        // Actualizamos visualmente al instante para que no se sientan "no leídas" al volver a entrar
        setNotificaciones((prev) =>
          prev.map((noti) => ({ ...noti, isRead: true }))
        );
      }
    } catch (error) {
      console.error("Error al sincronizar buzón:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [user?.id]);

  const handleAceptarAmistad = async (n: any) => {
    if (!user?.id || !n.senderId) {
      showNotification("Error de protocolo: ID no detectado.", "error");
      return;
    }

    // 1. INTERFAZ OPTIMISTA: Cambiamos el estado local al instante para ocultar el botón
    setNotificaciones((prev) =>
      prev.map((noti) =>
        noti.id === n.id ? { ...noti, aceptada: true } : noti
      )
    );

    // 2. Petición silenciosa al backend
    const res = await socialService.acceptRequest(n.senderId, user.id);

    if (res) {
      showNotification("¡Vínculo establecido con éxito!", "success");
      // Ya no llamamos a cargarNotificaciones() para que no parpadee ni borre nuestro "badge" optimista
    } else {
      showNotification(
        "Error al procesar la solicitud en el servidor.",
        "error"
      );
      // Solo recargamos si el servidor falló, para revertir el botón
      cargarNotificaciones();
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
        <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto animate-in fade-in duration-500 pb-16">
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic">
              Buzón de Actividad
            </h2>
          </div>
        </div>
      </div>

      {/* LISTADO DE NOTIFICACIONES */}
      <div className="space-y-3">
        {notificaciones.length === 0 ? (
          <div className="bg-white rounded-3xl py-20 text-center border-2 border-dashed border-slate-100">
            <Ghost className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
              No hay actividad reciente en el radar.
            </p>
          </div>
        ) : (
          notificaciones.map((n) => {
            const isLeida = n.isRead || n.read;

            return (
              <div
                key={n.id}
                className={`group p-4 md:p-5 rounded-3xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                  isLeida
                    ? "bg-slate-50/50 border-slate-100 opacity-70 hover:opacity-100"
                    : "bg-white border-indigo-100 shadow-sm shadow-indigo-100/50 ring-2 ring-indigo-50/50"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-105 shrink-0 ${
                        n.type === "FRIEND_REQUEST"
                          ? "bg-indigo-600 text-white shadow-indigo-200"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <UserPlus className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="font-black text-slate-800 uppercase italic tracking-tight text-sm md:text-base leading-snug">
                        {n.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 mt-2 md:mt-0">
                    {/* BOTÓN ORIGINAL: Se oculta si ya se hizo click */}
                    {n.type === "FRIEND_REQUEST" && !isLeida && !n.aceptada && (
                      <button
                        onClick={() => handleAceptarAmistad(n)}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5" /> Aceptar
                      </button>
                    )}

                    {/* BADGE DE CONFIRMACIÓN: Aparece instantáneamente al hacer click */}
                    {n.aceptada && (
                      <div className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5" /> Aceptado
                      </div>
                    )}

                    {/* Mostramos el botón de ir al perfil solo si hay un senderId válido */}
                    {n.senderId && (
                      <Link
                        href={`/user/${n.senderId}`}
                        className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center"
                        title="Ver Perfil"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
