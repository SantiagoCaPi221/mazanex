interface Props {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
}

export default function LoginInput({
  label,
  type,
  placeholder,
  value,
  error,
  onChange,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-4 bg-slate-50 border ${
          error ? "border-red-200" : "border-slate-200"
        } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
      />
    </div>
  );
}
