import { ShieldCheck, AlertCircle } from "lucide-react";

interface Props {
  text: string;
  type: "success" | "error";
}

export default function SecurityAlert({ text, type }: Props) {
  return (
    <div
      className={`p-4 rounded-2xl flex gap-3 text-sm font-bold ${
        type === "error"
          ? "bg-red-50 text-red-600"
          : "bg-green-50 text-green-600"
      }`}
    >
      {type === "error" ? (
        <AlertCircle className="w-5 h-5 shrink-0" />
      ) : (
        <ShieldCheck className="w-5 h-5 shrink-0" />
      )}

      {text}
    </div>
  );
}
