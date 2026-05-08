"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, UserCircle2 } from "lucide-react";

export default function ComunidadPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("/api/gateway/perfil");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsuarios(data);
          }
        }
      } catch (error) {
        console.error("Error al cargar la comunidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in zoom-in duration-300">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Comunidad Mazanex
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Descubre otros desarrolladores y explora sus perfiles.
          </p>
        </div>

        {/* Buscador (Visual por ahora) */}
        <div className="relative w-full md:w-72">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Grid de Usuarios */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : usuarios.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {usuarios.map((usr) => (
            <div
              key={usr.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all group flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl mb-4 overflow-hidden bg-slate-100 ring-4 ring-white shadow-md">
                {usr.avatarUrl ? (
                  <img
                    src={usr.avatarUrl}
                    alt={usr.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="w-full h-full text-slate-300 p-2" />
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1">
                {usr.nombre}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4 truncate w-full">
                {usr.email}
              </p>

              <Link
                href={`/u/${usr.id}`}
                className="w-full py-2.5 bg-slate-50 text-indigo-600 font-bold text-sm rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"
              >
                Ver Perfil
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">
            Aún no hay más usuarios
          </h3>
          <p className="text-slate-500 mt-2">
            Eres el pionero de esta plataforma.
          </p>
        </div>
      )}
    </div>
  );
}
