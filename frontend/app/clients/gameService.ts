import { BACKEND_URLS } from "@/app/config/endpoints";

const BASE_RANKING = BACKEND_URLS.RANKING;

export const gameService = {
  // Obtener puntajes de un usuario
  async getScoresByUserId(userId: number) {
    try {
      const response = await fetch(`${BASE_RANKING}/user/${userId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error fetching user scores:", error);
      return [];
    }
  },

  // Reportar una evidencia enviando quién reporta
  async reportScore(scoreId: number, reporterId: number) {
    try {
      const response = await fetch(`${BASE_RANKING}/report/${scoreId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId }),
      });

      if (response.status === 400 || response.status === 409) {
        return { error: "ALREADY_REPORTED" };
      }

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error reporting score:", error);
      return null;
    }
  },

  // Guardar un nuevo récord
  async saveScore(scoreData: {
    userId: number;
    game: string;
    highScore: number;
    screenshotUrl: string;
    mode: string;
  }) {
    try {
      const response = await fetch(`${BASE_RANKING}/save-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error saving score:", error);
      return null;
    }
  },

  // Obtener Ranking Global
  async getRanking(game: string) {
    try {
      const response = await fetch(`${BASE_RANKING}/${game}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error fetching ranking:", error);
      return [];
    }
  },
};
