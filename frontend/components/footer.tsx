"use client";
import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#030712] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* LOGO & COPYRIGHT */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-white font-black tracking-tighter text-xl">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            MAZANEX
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Protocolo de Competición
          </p>
        </div>

        {/* STATUS / VERSION */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Servidores Online
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            v1.0.4-STABLE
          </span>
        </div>

        {/* CREDIT */}
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Desarrollado por{" "}
          <span className="text-white hover:text-indigo-400 transition-colors cursor-pointer">
            team Mazanex
          </span>
        </div>
      </div>
    </footer>
  );
}
