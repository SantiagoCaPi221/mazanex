import { BACKEND_URLS } from "@/app/config/endpoints";

const BASE_RANKING = BACKEND_URLS.RANKING;

// 1. DEFINIMOS EL CONTRATO DE DATOS
// Esto debe coincidir exactamente con los nombres de campo de tu ScoreRequestDto en Java
// En tu archivo gameService.ts

export interface ScorePayload {
  userId: number;        // Corresponde a la columna user_id
  player_name: string;    // Corresponde a la columna player_name
  game: string;          // Corresponde a la columna game
  mode: string;          // Corresponde a la columna mode
  highScore: number;     // Corresponde a la columna high_score
  screenshotUrl: string; // Corresponde a la columna screenshot_url
}

const getAuthHeaders = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: any = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
    const cleanToken = token.replace(/['"]+/g, '');
    headers["Authorization"] = `Bearer ${cleanToken}`;
  }
  
  return headers;
};

export const gameService = {
  // ... resto de métodos (getScoresByUserId, reportScore, getRanking)

  // 2. ACTUALIZAMOS EL TIPO DE DATO AQUÍ
  async saveScore(scoreData: ScorePayload) {
    try {
      const response = await fetch(`${BASE_RANKING}/save-record`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(scoreData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error al guardar:", error);
      return null;
    }
  },
  
  // ... resto del objeto
};