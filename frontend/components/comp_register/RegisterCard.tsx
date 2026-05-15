"use client";

import RegisterHeader from "./RegisterHeader";
import RegisterInput from "./RegisterInput";
import RegisterError from "./RegisterError";
import RegisterButton from "./RegisterButton";
import { useRegister } from "@/app/hooks/register/useRegister";

export default function RegisterCard() {
  const { formData, error, isLoading, handleChange, handleSubmit } =
    useRegister();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-2xl shadow-xl border w-full max-w-md space-y-6"
    >
      <RegisterHeader />

      {error && <RegisterError message={error} />}

      <div className="space-y-4">
        <RegisterInput
          label="Nombre"
          type="text"
          value={formData.name}
          placeholder="Tu nombre"
          onChange={(v) => handleChange("name", v)}
        />

        <RegisterInput
          label="Correo"
          type="email"
          value={formData.email}
          placeholder="correo@mail.com"
          onChange={(v) => handleChange("email", v)}
        />

        <RegisterInput
          label="Contraseña"
          type="password"
          value={formData.password}
          placeholder="••••••••"
          onChange={(v) => handleChange("password", v)}
        />
      </div>

      <RegisterButton isLoading={isLoading} />
    </form>
  );
}
