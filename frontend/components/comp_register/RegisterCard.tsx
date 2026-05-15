import RegisterHeader from "./RegisterHeader";
import RegisterInput from "./RegisterInput";
import RegisterFooter from "./RegisterFooter";

import { RegisterData } from "@/app/types/auth";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (field: keyof RegisterData, value: string) => void;
  formData: RegisterData;
  error: string | null;
  isLoading: boolean;
}

export default function RegisterCard({
  handleSubmit,
  handleChange,
  formData,
  error,
  isLoading,
}: Props) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6"
    >
      <RegisterHeader />

      {/* NAME */}
      <RegisterInput
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* EMAIL */}
      <RegisterInput
        type="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      {/* PASSWORD */}
      <RegisterInput
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      {/* ERROR */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isLoading ? "Creando cuenta..." : "Registrarse"}
      </button>

      <RegisterFooter />
    </form>
  );
}
