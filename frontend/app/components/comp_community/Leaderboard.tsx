"use client";

import { Camera } from "lucide-react";
import type { RankingEntry } from "@/app/components/types/community";

type Props = {
  data: RankingEntry[];
  game: string;
  onSelectEvidence: (score: RankingEntry) => void;
};

export function Leaderboard({ data, game, onSelectEvidence }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border border-white/5 border-dashed rounded-3xl bg-white/[0.01]">
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Sin registros. ¡Sé el primero!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((score: any, index: number) => {
        const isGold = index === 0;
        const isSilver = index === 1;
        const isBronze = index === 2;

        const positionColor = isGold
          ? "text-[#F1C40F]"
          : isSilver
          ? "text-slate-300"
          : isBronze
          ? "text-[#CD7F32]"
          : "text-slate-600";

        const playerName =
          score.user?.name ||
          score.username ||
          score.playerName ||
          "Jugador Oculto";
        const scoreValue = score.highScore || score.puntajeMaximo || 0;
        const modeValue = score.mode || score.modo || "ESTÁNDAR";
        const isKofWithImage = game === "KOF" && score.screenshotUrl;

        return (
          <div
            key={score.id || index}
            onClick={() => {
              if (isKofWithImage) onSelectEvidence(score);
            }}
            className={`flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group ${
              isKofWithImage ? "cursor-pointer" : "cursor-default"
            }`}
            title={isKofWithImage ? "Ver Evidencia" : ""}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 text-center font-black italic text-xl ${positionColor}`}
              >
                #{index + 1}
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase italic truncate max-w-[120px] md:max-w-[150px]">
                  {playerName}
                </p>
                <p className="text-[8px] font-bold text-indigo-400/60 uppercase tracking-widest mt-0.5">
                  {modeValue}
                </p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2">
                {isKofWithImage && (
                  <Camera className="w-4 h-4 text-indigo-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                )}
                <p className="text-lg font-black text-indigo-400 group-hover:text-indigo-300 transition-colors tracking-tighter">
                  {scoreValue.toLocaleString()}
                </p>
              </div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                PTS
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
