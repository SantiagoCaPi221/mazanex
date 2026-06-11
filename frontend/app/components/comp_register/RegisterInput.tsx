interface Props {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  error?: boolean;
  onChange: (value: string) => void;
}

export default function RegisterInput({
  label,
  type,
  value,
  placeholder,
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
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-4 bg-slate-50 border ${
          error ? "border-red-200" : "border-slate-200"
        } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500`}
      />
    </div>
  );
}
