"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/authService";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function RegisterPage() {
  const { showNotification } = useUserStore();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = await authService.register(formData);

    if (success) {
      showNotification(
        "¡Cuenta creada! Ahora puedes iniciar sesión.",
        "success"
      );
      router.push("/login");
    } else {
      setError("No se pudo crear la cuenta. Intenta con otro nombre.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-slate-900">
          Crear cuenta
        </h1>
        <p className="text-center text-slate-500">
          Únete a la comunidad de Mazanex
        </p>

        <input
          type="text"
          placeholder="Nombre de usuario"
          required
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
        >
          Registrarse
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-indigo-600 font-bold">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
