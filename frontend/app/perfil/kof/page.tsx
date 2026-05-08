"use client";

import { useRef } from "react";
import { Gamepad2, Info, Maximize, Settings2 } from "lucide-react";

export default function KofPage() {
  // 1. AHORA LA REFERENCIA APUNTA A UN DIV, NO AL IFRAME
  const contenedorRef = useRef<HTMLDivElement>(null);

  const pantallaCompleta = () => {
    if (contenedorRef.current) {
      if (contenedorRef.current.requestFullscreen) {
        contenedorRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <span className="p-2 bg-orange-100 rounded-xl">
            <Gamepad2 className="w-5 h-5 text-orange-600" />
          </span>
          The King of Fighters 2002
        </h3>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
            Arcade Emulator
          </span>
          <button
            onClick={pantallaCompleta}
            className="flex items-center gap-2 text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full uppercase tracking-tighter transition-colors shadow-md"
          >
            <Maximize className="w-3 h-3" /> Fullscreen
          </button>
        </div>
      </div>

      {/* 2. PONEMOS EL REF EN EL CONTENEDOR DIV */}
      <div
        ref={contenedorRef}
        className="relative w-full aspect-[4/3] md:aspect-video bg-black rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-black flex items-center justify-center"
      >
        <iframe
          src="https://www.retrogames.cc/embed/10386-the-king-of-fighters-2002-magic-plus-bootleg-bootleg.html"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          allow="fullscreen" // Agregamos este permiso moderno por si acaso
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}
