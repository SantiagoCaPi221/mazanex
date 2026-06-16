import { BACKEND_URLS } from "@/app/config/endpoints";
import { authService } from "./authService";  

// Tipamos la respuesta para evitar el uso de 'any'
const getAuthHeaders = (): Record<string, string> => {
  const token = authService.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token.trim() !== "") {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠️ [profileService] No se detectó un token válido en authService.getToken().");
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
        console.warn(`❌ Error al obtener perfiles: ${response.status} ${response.statusText}`);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("💥 Error de red al obtener todos los perfiles:", error);
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
      
      const headers = getAuthHeaders();

      // Log temporal para que verifiques en la consola del navegador antes de que salga la petición
      console.log(`🚀 Enviando PUT a perfil ${id}. Headers configurados:`, headers);

      const response = await fetch(`${BACKEND_URLS.PROFILE}/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(adaptedData),
      });

      if (!response.ok) {
        // Esto te dirá en consola si el servidor respondió 403 de forma explícita
        console.error(`❌ Error en la petición PUT: Servidor respondió con estatus ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("💥 Error de red en updateProfile:", error);
      return null;
    }
  },
};