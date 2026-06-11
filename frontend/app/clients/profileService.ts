import { BACKEND_URLS } from "@/app/config/endpoints";

export const profileService = {
  async getAllProfiles() {
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/list`);
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
      const response = await fetch(`${BACKEND_URLS.PROFILE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adaptedData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },
};
