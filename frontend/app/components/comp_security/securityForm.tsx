import { PasswordForm } from "@/app/components/types/security";

interface Props {
  pass: PasswordForm;

  setPass: React.Dispatch<React.SetStateAction<PasswordForm>>;

  loading: boolean;

  updatePassword: (e: React.FormEvent) => Promise<void>;
}

export default function SecurityForm({
  pass,
  setPass,
  loading,
  updatePassword,
}: Props) {
  return (
    <form onSubmit={updatePassword} className="space-y-4">
      <input
        type="password"
        placeholder="Clave actual"
        required
        value={pass.current}
        onChange={(e) =>
          setPass({
            ...pass,
            current: e.target.value,
          })
        }
        className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-500 font-bold text-slate-700"
      />

      <input
        type="password"
        placeholder="Nueva clave"
        required
        value={pass.new}
        onChange={(e) =>
          setPass({
            ...pass,
            new: e.target.value,
          })
        }
        className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-500 font-bold text-slate-700"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Actualizar Credenciales"}
      </button>
    </form>
  );
}
