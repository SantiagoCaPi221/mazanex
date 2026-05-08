"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { authService } from "@/service/authService";
import Link from "next/link";

export default function LoginPage() {
  const { login, showNotification } = useUserStore();

  const [credentials, setCredentials] = useState({ nombre: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!credentials.nombre || !credentials.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);
    const user = await authService.login(credentials);
    setIsLoading(false);

    if (user) {
      login(user);
      showNotification("¡Sesión iniciada con éxito!", "success");
      router.push("/perfil");
    } else {
      setError("Usuario o contraseña incorrectos. Verifica tus datos.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Bienvenido
          </h1>
          <p className="text-slate-500 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-in fade-in duration-300">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Usuario
            </label>
            <input
              type="text"
              placeholder="Ej: Damian Cotto"
              className={`w-full p-4 bg-slate-50 border ${
                error ? "border-red-200" : "border-slate-200"
              } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              onChange={(e) =>
                setCredentials({ ...credentials, nombre: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="•••••••••••"
              className={`w-full p-4 bg-slate-50 border ${
                error ? "border-red-200" : "border-slate-200"
              } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          {isLoading ? "Verificando..." : "Entrar"}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-bold hover:underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
