export function sortRankingByScore(players: any[]) {
  return [...players].sort((a, b) => b.score - a.score);
}
