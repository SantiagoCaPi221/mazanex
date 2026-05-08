"use client";

import { Gamepad2, Info, Zap } from "lucide-react";

export default function SmashPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <span className="p-2 bg-yellow-100 rounded-xl">
            <Zap className="w-5 h-5 text-yellow-600" />
          </span>
          Super Smash Bros
        </h3>
        <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
          Nintendo 64 Emulator
        </span>
      </div>

      {/* Contenedor del Juego (Iframe) */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-black rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl">
        <iframe
          src="https://www.retrogames.cc/embed/32117-super-smash-bros-usa.html"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}
