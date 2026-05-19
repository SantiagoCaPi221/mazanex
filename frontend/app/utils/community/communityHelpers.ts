import type { RankingEntry } from "@/app/types/community";

export function getPlayerName(score: RankingEntry): string {
  return (
    score.user?.name || score.username || score.playerName || "Jugador Oculto"
  );
}

export function getScoreValue(score: RankingEntry): number {
  return score.highScore || score.puntajeMaximo || 0;
}

export function getModeValue(score: RankingEntry): string {
  return score.mode || score.modo || "ESTÁNDAR";
}

export function isKofEvidence(game: string, score: RankingEntry): boolean {
  return game === "KOF" && !!score.screenshotUrl;
}
