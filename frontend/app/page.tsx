"use client";
import Link from "next/link";
import { useUserStore } from "../store/useUserStore";

export default function Home() {
  const user = useUserStore((state: any) => state.user);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          ¡Te damos la bienvenida a{" "}
          <span className="text-indigo-600">Mazanex</span>!
        </h1>

        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Simplificamos la gestión de tus microservicios con tecnología de
          vanguardia.
          {user
            ? ` Es genial verte de nuevo, ${user.name}.` // Ahora sí, usando name
            : " Únete a nuestra plataforma para empezar a explorar."}
        </p>

        <div className="flex gap-4 justify-center pt-4">
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/profile"
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95 text-lg"
              >
                Ir a mi Perfil
              </Link>
              <Link
                href="/community"
                className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-all active:scale-95 text-lg"
              >
                Explorar Comunidad
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95 text-lg"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-all active:scale-95 text-lg"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl pb-10">
        <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-indigo-100 transition-all hover:shadow-indigo-50">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-950">
            Potencia sin límites
          </h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Crecemos contigo. Nuestra arquitectura modular se adapta a tus
            necesidades sin esfuerzo, garantizando agilidad y rendimiento.
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-emerald-100 transition-all hover:shadow-emerald-50">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-950">
            Seguridad Total
          </h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Protegemos lo que más importa. Cumplimos con los más altos
            estándares éticos para asegurar la privacidad y protección de tus
            datos.
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-sky-100 transition-all hover:shadow-sky-50">
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-5">
            <svg
              className="w-6 h-6 text-sky-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-950">
            Experiencia Ágil
          </h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Diseñado para personas. Disfruta de una interfaz fluida, rápida y
            moderna que hace tu trabajo diario más sencillo y eficiente.
          </p>
        </div>
      </div>
    </div>
  );
}
