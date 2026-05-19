import { Bell } from "lucide-react";

export default function NotificationHeader() {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic">
            Buzón de Actividad
          </h2>
        </div>
      </div>
    </div>
  );
}
