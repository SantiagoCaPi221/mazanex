import { BACKEND_URLS } from "@/app/config/endpoints";
import { authService } from "./authService";

const BASE_RANKING = BACKEND_URLS.RANKING;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${authService.getToken()}`
});

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
        headers: getAuthHeaders(), // ✅ Token enviado
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
        headers: getAuthHeaders(), // ✅ Token enviado
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