"use client";

import Link from "next/link";
import LoginHeader from "./LoginHeader";
import LoginInput from "./LoginInput";
import LoginError from "./LoginError";
import LoginButton from "./LoginButton";
import { useLogin } from "@/app/components/hooks/login/useLogin";

export default function LoginForm() {
  const { credentials, error, isLoading, handleChange, handleLogin } =
    useLogin();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6"
      >
        <LoginHeader />

        {error && <LoginError message={error} />}

        <div className="space-y-4">
          <LoginInput
            label="Usuario o Correo"
            type="text"
            placeholder="Ej: Damian Cotto o correo@mail.com"
            value={credentials.identifier}
            onChange={(value) => handleChange("identifier", value)}
            error={!!error}
          />

          <LoginInput
            label="Contraseña"
            type="password"
            placeholder="•••••••••••"
            value={credentials.password}
            onChange={(value) => handleChange("password", value)}
            error={!!error}
          />
        </div>

        <LoginButton isLoading={isLoading} />

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/pages/register"
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
