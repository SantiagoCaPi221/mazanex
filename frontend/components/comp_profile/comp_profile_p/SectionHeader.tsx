import { User, Check, Edit2 } from "lucide-react";

interface Props {
  isEditing: boolean;
  loading: boolean;
  handleSave: () => void;
  setIsEditing: (value: boolean) => void;
}

export default function SectionHeader({
  isEditing,
  loading,
  handleSave,
  setIsEditing,
}: Props) {
  return (
    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <User className="w-5 h-5" />
        </div>

        <h2 className="text-xl font-black text-slate-900">
          Información del Perfil
        </h2>
      </div>

      <button
        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
          isEditing
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isEditing ? (
          <>
            <Check className="w-4 h-4" />
            Guardar Cambios
          </>
        ) : (
          <>
            <Edit2 className="w-4 h-4" />
            Editar Perfil
          </>
        )}
      </button>
    </div>
  );
}
