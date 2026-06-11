"use client";

import { Dispatch, SetStateAction } from "react";

type Props = {
  games: string[];
  selected: string;
  onChange: Dispatch<SetStateAction<string>>;
  currentSubMode?: string;
  onSubModeChange?: (mode: string) => void;
  snakeModes?: string[];
};

export function GameSelector({
  games,
  selected,
  onChange,
  currentSubMode = "TODOS",
  onSubModeChange,
  snakeModes = [],
}: Props) {
  return (
    <>
      {/* Selector de Juego Principal */}
      <div className="flex flex-wrap gap-2 mb-6">
        {games.map((game) => (
          <button
            key={game}
            onClick={() => {
              onChange(game);
              if (onSubModeChange) onSubModeChange("TODOS");
            }}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1 text-center ${
              selected === game
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Selector de Sub-Modos para SNAKE (Scroll horizontal ocultando barra) */}
      {selected === "SNAKE" && snakeModes.length > 0 && onSubModeChange && (
        <div className="flex overflow-x-auto flex-nowrap gap-2 mb-6 pb-2 border-b border-white/5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => onSubModeChange("TODOS")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              currentSubMode === "TODOS"
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            TODOS LOS MODOS
          </button>
          {snakeModes.map((mode) => (
            <button
              key={mode}
              onClick={() => onSubModeChange(mode)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                currentSubMode === mode
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
