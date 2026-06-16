"use client";

import { useState, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { gameService } from "@/service/gameService";
import { Trophy, Upload, Send, ShieldAlert, XCircle } from "lucide-react";

interface Props {
  game: string; // Cambiado de 'juego' a 'game'
  onSuccess: () => void;
}

export default function EmulatorSubmission({ game, onSuccess }: Props) {
  const { user, showNotification } = useUserStore();
  const [score, setScore] = useState("");
  const [imgBase64, setImgBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showNotification("Imagen muy pesada (Máx 3MB)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImgBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !score || !imgBase64) {
      showNotification("Faltan datos del récord", "error");
      return;
    }

    setIsLoading(true);

    // Usando el gameService y las variables en inglés para el backend
    const isSuccess = await gameService.saveScore({
      userId: user.id,
      game: game,
      mode: "ARCADE MODE",
      highScore: Number(score),
      screenshotUrl: imgBase64,
    });

    if (isSuccess) {
      showNotification("Récord enviado con éxito", "success");
      onSuccess();
    } else {
      showNotification("No superaste tu récord actual", "info");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">
            Reportar Récord
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
            Evidencia Directa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">
            Puntaje Final
          </label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="000000"
            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 font-black outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-50 transition-all"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">
            Captura de Pantalla
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!imgBase64 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
            >
              <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Seleccionar Archivo
              </span>
            </button>
          ) : (
            <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border-2 border-indigo-100 group">
              <img
                src={imgBase64}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setImgBase64(null)}
                  className="bg-white text-rose-500 p-2 rounded-full shadow-xl hover:scale-110 transition-all"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !imgBase64 || !score}
          className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />{" "}
          {isLoading ? "PROCESANDO..." : "ENVIAR A MURO"}
        </button>
      </form>
    </div>
  );
}
