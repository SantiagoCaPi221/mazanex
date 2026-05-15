"use client";

import { useEffect, useState } from "react";

import { profileService } from "@/service/profileService";

import { RankingPlayer } from "../../types/community";

import { sortRankingByScore } from "../../utils/community/ranking";

export function useRanking() {
  const [selectedGame, setSelectedGame] = useState("SNAKE");

  const [ranking, setRanking] = useState<RankingPlayer[]>([]);

  const [loadingRanking, setLoadingRanking] = useState(false);

  const availableGames = ["SNAKE", "KOF", "BLOODY", "SMASH"];

  const loadRanking = async () => {
    setLoadingRanking(true);

    try {
      const topScores = await profileService.getRanking(selectedGame);

      setRanking(sortRankingByScore(topScores || []));
    } catch (error) {
      console.error("Error loading ranking:", error);
    } finally {
      setLoadingRanking(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, [selectedGame]);

  return {
    ranking,
    loadingRanking,

    selectedGame,
    setSelectedGame,

    availableGames,
  };
}
