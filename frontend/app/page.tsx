"use client";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";
import { Trophy, Users, Zap, Target, Bot, Star } from "lucide-react";
import { useState } from "react";
import Footer from "@/app/components/Footer";

export default function Home() {
  const user = useUserStore((state: any) => state.user);
  const [avatarError, setAvatarError] = useState(false);

  // Fallback para el avatar si falla (Cambiado user.nombre a user.name)
  const iniciales = user?.name?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white flex flex-col justify-between">
      {/* CAPA 1: TÉCNICA (GRID DE FONDO) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.10]"
        style={{
          backgroundImage: `linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* CAPA 2: EFECTO DE ESCANEO DE LÍNEA (SCANLINE) */}
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAABZJREFUGFdjTGRgYOBmYGBgOMSAAtidAGU1BAs3gWwHAAAAAElFTkSuQmCC')`,
        }}
      />

      {/* CAPA 3: RESPLANDORES NEÓN DINÁMICOS (GLOW) */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow delay-1000" />

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-12 px-6 max-w-7xl mx-auto w-full flex-1">
        {/* BADGE DE BIENVENIDA - Escala reducida */}
        <div className="mb-8 flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-xl transition-all hover:border-indigo-500/30">
          {user ? (
            <>
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-indigo-400 shrink-0">
                {user.avatarUrl && !avatarError ? (
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-black text-[10px] text-white uppercase">
                    {iniciales}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xs font-black text-white">
                  Bienvenido de vuelta,{" "}
                  <span className="italic">{user.name}</span>
                </h4>
              </div>
              <Star className="w-3 h-3 text-indigo-400 ml-1 shrink-0" />
            </>
          ) : (
            <>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            </>
          )}
        </div>

        {/* HERO: TÍTULO CON ESCALA CORREGIDA (NO SE CORTA) */}
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic transition-all">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 via-purple-400 to-indigo-900 drop-shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              Alcanza el mazanex
            </span>
          </h1>

          {/* BOTONES DE ACCIÓN - Escala Normalizada */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
              <>
                <Link
                  href="/pages/profile"
                  className="group relative px-8 py-3.5 bg-white text-black font-black rounded-lg overflow-hidden transition-all active:scale-95 shadow-lg"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2 text-sm uppercase italic">
                    Entrar al Perfil{" "}
                    <Target className="w-4 h-4 group-hover:rotate-[360deg] transition-transform duration-700" />
                  </div>
                </Link>
                <Link
                  href="/pages/community"
                  className="px-8 py-3.5 bg-transparent text-white border border-white/20 font-black rounded-lg hover:bg-white/5 transition-all active:scale-95 text-sm uppercase italic flex items-center justify-center gap-2"
                >
                  Ver Comunidad <Users className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/pages/login"
                  className="px-10 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all active:scale-95 text-sm uppercase italic"
                >
                  Unirse a Mazanex
                </Link>
                <Link
                  href="/pages/register"
                  className="px-10 py-4 bg-white/5 text-white border border-white/10 font-black rounded-xl hover:bg-white/10 transition-all active:scale-95 text-sm uppercase italic"
                >
                  Crear Registro
                </Link>
              </>
            )}
          </div>
        </div>

        {/* STATS / FEATURES CARDS - Escala Corregida */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 w-full border border-white/5 rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl shadow-2xl">
          <GamerCard
            icon={<Trophy className="w-7 h-7 text-indigo-400" />}
            title="RANKING GLOBAL"
            desc="Compite en tiempo real en los juegos más desafiantes. Demuestra tu habilidad y escala hasta la cima de la tabla."
          />
          <GamerCard
            icon={<Users className="w-7 h-7 text-purple-400" />}
            title="COMUNIDAD MAZANEX"
            desc="Conecta con otros jugadores, crea tu red de amigos y comparte tus mejores momentos en el muro social."
          />
          <GamerCard
            icon={<Zap className="w-7 h-7 text-amber-400" />}
            title="MONITOREO DE PROYECTOS"
            desc="Analítica avanzada del progreso de desarrollo. Gestión de tareas y recursos con visibilidad total para el equipo."
          />
        </div>
        </div>

      {/* FOOTER INYECTADO DESDE SU PROPIO ARCHIVO */}
      <Footer />
    </div>
  );
}

function GamerCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 border-white/5 md:border-r last:border-0 hover:bg-white/[0.03] transition-all duration-700 group flex flex-col items-center text-center lg:items-start lg:text-left">
      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
        {icon}
      </div>
      <h3 className="text-lg font-black mb-3 tracking-widest text-white italic uppercase">
        {title}
      </h3>
      <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
        {desc}
      </p>
    </div>
  );
}
