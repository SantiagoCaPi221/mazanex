"use client";

import { X, ShieldAlert } from "lucide-react";
import type { RankingEntry } from "@/app/components/types/community";

type Props = {
  evidence: RankingEntry | null;
  onClose: () => void;
  onReport: (id: number) => void;
};

export function EvidenceModal({ evidence, onClose, onReport }: Props) {
  if (!evidence?.screenshotUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
      >
        <X className="w-10 h-10" />
      </button>

      <div
        className="relative max-w-5xl w-full flex flex-col items-center gap-6 animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={evidence.screenshotUrl}
          className="max-w-full max-h-[75vh] rounded-3xl shadow-2xl border border-white/10 object-contain"
          alt="Evidencia del Récord"
        />

        <button
          onClick={() => onReport(evidence.id)}
          className="flex items-center gap-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all border border-rose-500/20 shadow-xl active:scale-95"
        >
          <ShieldAlert className="w-4 h-4" /> Reportar Evidencia
        </button>
      </div>
    </div>
  );
}
