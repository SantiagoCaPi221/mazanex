import { BACKEND_URLS } from "@/app/config/endpoints";

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

export const profileService = {
  /**
   * Obtiene la lista global de perfiles para la vista de Descubrir
   */
  async getAllProfiles() {
    const headers = getAuthHeaders();
    console.log("🚀 Enviando GET /api/profile/list con headers:", headers);
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/list`, { headers });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error en getAllProfiles:", error);
      return [];
    }
  },

  /**
   * Actualiza los datos de un perfil específico (Biografía, Nombre, Avatar, Banner, etc.)
   */
  async updateProfile(id: number, profileData: any) {
    const headers = getAuthHeaders();
    console.log(`🚀 Enviando PUT /api/profile/${id} con headers:`, headers);
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(profileData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error en updateProfile:", error);
      return null;
    }
  }
};