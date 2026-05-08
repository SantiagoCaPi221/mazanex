"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { perfilService } from "@/service/perfilService";
import { User, Mail, Edit3, Save, Loader2 } from "lucide-react";

export default function Page() {
  const user = useUserStore((state: any) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);
  const showNotification = useUserStore((state: any) => state.showNotification);

  const [isEditing, setIsEditing] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(false);

  // Sincronizar el estado local cuando el usuario carga del store
  useEffect(() => {
    if (user?.nombre) {
      setNuevoNombre(user.nombre);
    }
  }, [user]);

  const save = async () => {
    if (!user?.id) {
      showNotification("Error: No se encontró ID de usuario", "error");
      return;
    }

    setLoading(true);
    try {
      // Enviamos solo los campos necesarios para evitar payloads gigantes innecesarios
      const data = await perfilService.actualizarPerfil(user.id, {
        nombre: nuevoNombre,
        avatarUrl: user.avatarUrl,
        bannerUrl: user.bannerUrl,
      });

      if (data) {
        setUser(data); // Actualizamos Zustand con la respuesta del servidor
        setIsEditing(false);
        showNotification("¡Perfil actualizado con éxito!", "success");
      } else {
        showNotification(
          "Error al guardar: El servidor no respondió correctamente",
          "error"
        );
      }
    } catch (err) {
      showNotification("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
        <User className="w-5 h-5 text-indigo-500" /> Información del Perfil
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Nombre Público
          </label>
          <div className="flex gap-3">
            <input
              disabled={!isEditing || loading}
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className={`flex-grow p-4 rounded-2xl font-bold outline-none transition-all ${
                isEditing
                  ? "bg-slate-50 border border-indigo-200 ring-2 ring-indigo-50"
                  : "bg-slate-50/50 border-transparent text-slate-600"
              }`}
            />
            <button
              onClick={isEditing ? save : () => setIsEditing(true)}
              disabled={loading}
              className="px-6 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
              {loading ? "Cargando..." : isEditing ? "Guardar" : "Editar"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Email
          </label>
          <div className="p-4 bg-slate-50/30 border border-slate-100 rounded-2xl text-slate-400 font-medium flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" /> {user?.email || "Cargando..."}
            </div>
            <span className="text-[9px] bg-slate-200 px-2 py-1 rounded text-slate-500 font-black">
              NO EDITABLE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
