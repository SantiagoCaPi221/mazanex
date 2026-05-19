import {
  getPlayerName,
  getScoreValue,
  getModeValue,
  isKofEvidence,
} from "@/app/utils/community/communityHelpers";

import type { RankingEntry } from "@/app/types/community";

type Props = {
  data: RankingEntry[];
  game: string;
  onSelectEvidence: (score: RankingEntry) => void;
};

export function Leaderboard({ data, game, onSelectEvidence }: Props) {
  return (
    <div className="space-y-3">
      {data.map((score, index) => {
        const playerName = getPlayerName(score);
        const value = getScoreValue(score);
        const mode = getModeValue(score);
        const isEvidence = isKofEvidence(game, score);

        return (
          <div
            key={score.id || index}
            onClick={() => isEvidence && onSelectEvidence(score)}
            className={`flex justify-between p-4 rounded-xl border ${
              isEvidence ? "cursor-pointer" : ""
            }`}
          >
            <div>
              <p className="font-bold">{playerName}</p>
              <p className="text-xs opacity-60">{mode}</p>
            </div>

            <div className="text-right">
              <p className="font-black">{value}</p>
              <span className="text-xs">PTS</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
