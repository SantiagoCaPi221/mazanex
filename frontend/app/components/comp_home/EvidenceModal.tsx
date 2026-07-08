"use client";
import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";

interface EvidenceModalProps {
  score: number;
  game: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

export const EvidenceModal = ({ score, game, onSave, onClose }: EvidenceModalProps) => {
  const [url, setUrl] = useState("");

  const handleConfirm = () => {
    if (!url.startsWith("http"))
      return alert("Ingresa una URL de imagen válida");
    onSave(url);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#0a0f1e] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
            <Camera className="text-indigo-500" /> Certificar Récord
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X />
          </button>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 text-center mb-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            Puntaje Obtenido
          </p>
          <p className="text-4xl font-black text-white italic">
            {score.toLocaleString()}{" "}
            <span className="text-sm text-indigo-400">PTS</span>
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
            URL de la Captura
          </label>
          <input
            type="text"
            placeholder="https://imgur.com/tu-foto.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-mono text-xs"
          />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-900/20 flex items-center gap-2 uppercase italic text-xs tracking-widest"
          >
            Subir Evidencia <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
