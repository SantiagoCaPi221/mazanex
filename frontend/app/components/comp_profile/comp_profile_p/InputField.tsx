interface Props {
  label: string;
  icon: any;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
}

export default function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  disabled = false,
  type = "text",
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">
        {label}
      </label>

      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />

        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 font-medium text-slate-700"
        />
      </div>
    </div>
  );
}