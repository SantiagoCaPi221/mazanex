import type { RankingEntry } from "../types/community.types";

export function getSnakeModes(leaderboard: RankingEntry[]) {
  return Array.from(
    new Set(leaderboard.map((s) => s.mode || "ESTÁNDAR"))
  );
}

export function filterLeaderboard(
  data: RankingEntry[],
  mode: string
) {
  if (mode === "TODOS") return data;

  return data.filter(
    (s) => (s.mode || "ESTÁNDAR") === mode
  );
}