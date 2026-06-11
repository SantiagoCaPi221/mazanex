import { Lock } from "lucide-react";

export default function SecurityHeader() {
  return (
    <div className="text-center pb-4 border-b border-slate-50">
      <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-2" />

      <h3 className="text-xl font-black text-slate-900">Seguridad</h3>
    </div>
  );
}
