"use client";

import { useRef } from "react";
import { Gamepad2, Maximize, MonitorPlay, ShieldAlert } from "lucide-react";
import EmulatorSubmission from "@/app/components/EmulatorSubmission";
import { useRouter } from "next/navigation";

export default function KofPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-100">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">
              The King of Fighters 2002
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Neo-Geo Emulator
            </p>
          </div>
        </div>
        <button
          onClick={handleFullscreen}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-md"
        >
          <Maximize className="w-4 h-4 mr-2 inline" /> Fullscreen
        </button>
      </div>

      {/* EMULATOR */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl"
      >
        <iframe
          src="https://www.retrogames.cc/embed/10386-the-king-of-fighters-2002-magic-plus-bootleg-bootleg.html"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* REPORT SUBMISSION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-800 uppercase italic tracking-tighter text-sm">
              Protocolo de Récord
            </h4>
          </div>
          <div className="space-y-6">
            {[
              "Al finalizar, toma una captura (Screenshot) de tu puntaje.",
              "Selecciona el archivo directamente desde el explorador de archivos.",
              "Ingresa el valor numérico exacto y presiona Enviar.",
              "Tu récord aparecerá en tu muro tras la validación del sistema.",
            ].map((text, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-6 h-6 bg-slate-100 text-slate-400 text-[10px] font-black flex items-center justify-center rounded-lg italic">
                  0{i + 1}
                </span>
                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[9px] font-black text-amber-700 uppercase leading-relaxed tracking-wider">
              Cualquier evidencia falsa será reportada y el registro eliminado.
            </p>
          </div>
        </div>

        <EmulatorSubmission
          game="KOF" // Ajustado al estándar en inglés
          onSuccess={() => router.push("/profile")} // Ajustado a la ruta en inglés
        />
      </div>
    </div>
  );
}
