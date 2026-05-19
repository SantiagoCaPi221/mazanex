import { Ghost } from "lucide-react";

export default function NotificationEmpty() {
  return (
    <div className="bg-white rounded-3xl py-20 text-center border-2 border-dashed border-slate-100">
      <Ghost className="w-12 h-12 text-slate-200 mx-auto mb-4" />

      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
        No hay actividad reciente.
      </p>
    </div>
  );
}
