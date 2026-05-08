"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ShieldAlert,
  Zap,
  CircleDot,
  Clock,
  CheckCircle,
  Info,
} from "lucide-react";

const POOL_NOTIFICACIONES = [
  { t: "Sesión iniciada desde un nuevo dispositivo en Santiago.", s: "alert" },
  { t: "Mazanex: ¡Nuevas funciones de seguridad disponibles!", s: "info" },
  { t: "Se ha actualizado la política de privacidad global.", s: "sys" },
  { t: "Alerta: Intento de acceso fallido detectado.", s: "alert" },
  { t: "¡Tu perfil ha sido visitado 50 veces hoy!", s: "info" },
  { t: "Sincronización exitosa con el microservicio de Auth.", s: "sys" },
  { t: "Mantenimiento programado: Domingo 03:00 AM.", s: "info" },
  { t: "Se ha generado un nuevo token de acceso para la API.", s: "sys" },
  { t: "Cambio de contraseña detectado recientemente.", s: "alert" },
  { t: "¡Felicidades! Has completado tu perfil al 100%.", s: "sys" },
  { t: "Nueva IP detectada intentando acceder al Gateway.", s: "alert" },
  { t: "Mazanex Cloud: Tu almacenamiento está casi lleno.", s: "info" },
  { t: "Se ha verificado tu correo electrónico correctamente.", s: "sys" },
  { t: "Reporte semanal de actividad listo para revisar.", s: "info" },
  { t: "Alerta de seguridad: Revisa tus dispositivos vinculados.", s: "alert" },
  { t: "Nueva actualización del frontend disponible (v2.1).", s: "info" },
  { t: "Tu solicitud de soporte #4402 ha sido cerrada.", s: "sys" },
  { t: "Respaldo de base de datos completado en Railway.", s: "sys" },
  { t: "Se detectó un cambio en tu Nombre Público.", s: "info" },
  { t: "Protección contra fuerza bruta activada temporalmente.", s: "alert" },
  { t: "¡Novedad! Ahora puedes editar tu avatar en 1 clic.", s: "info" },
  { t: "Conexión estable con el servidor de notificaciones.", s: "sys" },
  { t: "Aviso: Tu sesión expirará en 15 minutos.", s: "alert" },
  { t: "Has desbloqueado la insignia 'Desarrollador Mazanex'.", s: "info" },
  { t: "Error de sincronización corregido automáticamente.", s: "sys" },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const cantidad = Math.floor(Math.random() * (7 - 2 + 1)) + 2;

    const seleccionadas = [...POOL_NOTIFICACIONES]
      .sort(() => 0.5 - Math.random())
      .slice(0, cantidad);

    setItems(seleccionadas);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            Actividad Reciente
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
            Tienes {items.length} actualizaciones nuevas
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
          <Bell className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        {items.map((it, i) => (
          <div
            key={i}
            className={`p-5 bg-white border border-slate-100 border-l-4 rounded-[2rem] flex gap-5 transition-all hover:shadow-xl hover:shadow-slate-100/50 group animate-in slide-in-from-right-4 duration-300`}
            style={{
              borderLeftColor:
                it.s === "alert"
                  ? "#ef4444"
                  : it.s === "info"
                  ? "#f59e0b"
                  : "#6366f1",
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                it.s === "alert"
                  ? "bg-red-50"
                  : it.s === "info"
                  ? "bg-amber-50"
                  : "bg-indigo-50"
              }`}
            >
              {it.s === "alert" ? (
                <ShieldAlert className="w-6 h-6 text-red-500" />
              ) : it.s === "info" ? (
                <Zap className="w-6 h-6 text-amber-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-indigo-500" />
              )}
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    it.s === "alert"
                      ? "text-red-400"
                      : it.s === "info"
                      ? "text-amber-400"
                      : "text-indigo-400"
                  }`}
                >
                  {it.s === "alert"
                    ? "Seguridad"
                    : it.s === "info"
                    ? "Novedad"
                    : "Sistema"}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Clock className="w-3 h-3" /> {i + 1}h
                </span>
              </div>
              <p className="font-bold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                {it.t}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-slate-300 font-medium">
          Las notificaciones se eliminan automáticamente después de 30 días.
        </p>
      </div>
    </div>
  );
}
