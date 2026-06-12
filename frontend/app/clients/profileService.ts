import { BACKEND_URLS } from "@/app/config/endpoints";
import { authService } from "./authService";  

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${authService.getToken()}`
});

export const profileService = {
  async getAllProfiles() {
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/list`, {
        method: "GET",
        headers: getAuthHeaders(), // ✅ Token inyectado
      });
      
      if (!response.ok) {
        console.warn(`Error al obtener perfiles: ${response.status}`);
        return [];
      }
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
        headers: getAuthHeaders(), // ✅ Token inyectado
        body: JSON.stringify(adaptedData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },
};