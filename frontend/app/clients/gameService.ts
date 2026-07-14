import { BACKEND_URLS } from "@/app/config/endpoints";
import type { RankingEntry } from "@/app/components/types/community";

const BASE_RANKING = BACKEND_URLS.RANKING;

const getAuthHeaders = () => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
    const cleanToken = token.replace(/['"]+/g, '');
    headers["Authorization"] = `Bearer ${cleanToken}`;
  }
  return headers;
};

export const gameService = {
  async getScoresByUserId(userId: number) {
    try {
      const response = await fetch(`${BASE_RANKING}/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },

  async reportScore(scoreId: number, reporterId: number) {
    try {
      const response = await fetch(`${BASE_RANKING}/report/${scoreId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reporterId }),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async saveScore(scoreData: Record<string, unknown>) {
    try {
      const response = await fetch(`${BASE_RANKING}/save-record`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(scoreData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async getRanking(game: string) {
    try {
      const response = await fetch(`${BASE_RANKING}/${game}`, {
        headers: getAuthHeaders(),
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },
};