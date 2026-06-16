import { BACKEND_URLS } from "@/app/config/endpoints";
import { authService } from "./authService";  

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

export const profileService = {
  async getAllProfiles() {
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/list`, {
        method: "GET",
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
        body: JSON.stringify(adaptedData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },
};