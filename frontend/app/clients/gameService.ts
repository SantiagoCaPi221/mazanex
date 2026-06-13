import { BACKEND_URLS } from "@/app/config/endpoints";
import { authService } from "./authService";

const BASE_RANKING = BACKEND_URLS.RANKING;

const getAuthHeaders = () => {
  const token = authService.getToken();
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (token && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const gameService = {
  async getScoresByUserId(userId: number) {
    try {
      // Público: no requiere headers
      const response = await fetch(`${BASE_RANKING}/user/${userId}`);
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

  async saveScore(scoreData: any) {
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
      const response = await fetch(`${BASE_RANKING}/${game}`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },
};