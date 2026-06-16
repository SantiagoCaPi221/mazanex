const GATEWAY_PROFILE = "/api/gateway/profile";

export const profileService = {
  async getAllProfiles() {
    try {
      const response = await fetch(`${GATEWAY_PROFILE}/list`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error al obtener todos los perfiles:", error);
      return [];
    }
  },

  async updateProfile(id: number, profileData: any) {
    try {
      const adaptedData = {
        name: profileData.name,
        bio: profileData.bio,
        avatarUrl: profileData.avatarUrl,
        bannerUrl: profileData.bannerUrl,
        backgroundUrl: profileData.backgroundUrl,
      };
      const response = await fetch(`${GATEWAY_PROFILE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adaptedData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async getRanking(game: string) {
    try {
      const response = await fetch(`${GATEWAY_PROFILE}/games/ranking/${game}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async saveScore(scoreData: any) {
    try {
      const response = await fetch(`${GATEWAY_PROFILE}/games/save-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async getScoresByUserId(userId: number) {
    try {
      const response = await fetch(`${GATEWAY_PROFILE}/games/user/${userId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error al obtener scores del usuario:", error);
      return [];
    }
  },

  async reportScore(scoreId: number) {
    try {
      const response = await fetch(
        `${GATEWAY_PROFILE}/games/report/${scoreId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // <-- Escudo antibugs para el Gateway
        }
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error al reportar score:", error);
      return null;
    }
  },
};
