import type { GameType } from "@/app/types/community";

type Props = {
  games: GameType[];
  selected: GameType;
  onChange: (game: GameType) => void;
};

export function GameSelector({ games, selected, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {games.map((game) => (
        <button
          key={game}
          onClick={() => onChange(game)}
          className={`px-4 py-2 rounded ${
            selected === game ? "bg-indigo-600 text-white" : "bg-white/10"
          }`}
        >
          {game}
        </button>
      ))}
    </div>
  );
}
