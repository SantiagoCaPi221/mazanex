"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { authService } from "@/service/authService";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

export default function SecurityPage() {
  const user = useUserStore((state: any) => state.user);
  const [pass, setPass] = useState({ current: "", new: "" });
  const [msg, setMsg] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const update = async (e: any) => {
    e.preventDefault();

    // Validación rápida en el frontend
    if (pass.new === pass.current) {
      return setMsg({
        text: "La nueva contraseña no puede ser igual a la actual.",
        type: "error",
      });
    }

    setLoading(true);
    setMsg(null);

    try {
      // Mandamos la petición al backend para que él valide la seguridad
      const res = await authService.updatePassword(user.id, {
        currentPassword: pass.current,
        newPassword: pass.new,
      });

      if (res) {
        setMsg({ text: "¡Contraseña actualizada con éxito!", type: "success" });
        setPass({ current: "", new: "" });
      }
    } catch (error) {
      setMsg({
        text: "La contraseña actual es incorrecta o hubo un problema.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="text-center pb-4 border-b border-slate-50">
        <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
        <h3 className="text-xl font-black text-slate-900">Seguridad</h3>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-2xl flex gap-3 text-sm font-bold ${
            msg.type === "error"
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {msg.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 shrink-0" />
          )}
          {msg.text}
        </div>
      )}

      <form onSubmit={update} className="space-y-4">
        <input
          type="password"
          placeholder="Clave actual"
          required
          value={pass.current}
          onChange={(e) => setPass({ ...pass, current: e.target.value })}
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-500 font-bold text-slate-700"
        />
        <input
          type="password"
          placeholder="Nueva clave"
          required
          value={pass.new}
          onChange={(e) => setPass({ ...pass, new: e.target.value })}
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-500 font-bold text-slate-700"
        />
        <button
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {loading ? "Actualizando..." : "Actualizar Credenciales"}
        </button>
      </form>
    </div>
  );
}
