"use client";

import { useEffect, useState } from "react";
import { gameService } from "@/app/clients/gameService";

import type { GameType, RankingEntry } from "@/app/components/types/community";

export function useRanking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loadingRanking, setLoading] = useState(false);

  const [selectedGame, setSelectedGame] = useState<GameType>("SNAKE");

  const availableGames: GameType[] = ["SNAKE", "KOF"];

  const fetchRanking = async () => {
    setLoading(true);

    try {
      const res = await gameService.getRanking(selectedGame);
      setRanking(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [selectedGame]);

  return {
    ranking,
    loadingRanking,

    selectedGame,
    setSelectedGame,

    availableGames,
  };
}
