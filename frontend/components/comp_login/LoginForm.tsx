interface Props {
  identifier: string;

  password: string;

  error: string | null;

  onChange: (field: "identifier" | "password", value: string) => void;
}

export default function LoginForm({
  identifier,
  password,
  error,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
          Usuario o Correo
        </label>

        <input
          type="text"
          value={identifier}
          placeholder="Ej: Damian Cotto o correo@mail.com"
          className={`w-full p-4 bg-slate-50 border ${
            error ? "border-red-200" : "border-slate-200"
          } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
          onChange={(e) => onChange("identifier", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
          Contraseña
        </label>

        <input
          type="password"
          value={password}
          placeholder="•••••••••••"
          className={`w-full p-4 bg-slate-50 border ${
            error ? "border-red-200" : "border-slate-200"
          } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
          onChange={(e) => onChange("password", e.target.value)}
        />
      </div>
    </div>
  );
}
