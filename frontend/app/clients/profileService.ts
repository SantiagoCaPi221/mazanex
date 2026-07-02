import { BACKEND_URLS } from "@/app/config/endpoints";

// Funcion auxiliar para obtener los headers con el token
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
  // Obtiene la lista global de perfiles
  async getAllProfiles() {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/list`, { headers });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error en getAllProfiles:", error);
      return [];
    }
  },

  // Obtiene un perfil especifico por ID
  async getProfile(id: number) {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${BACKEND_URLS.PROFILE}/${id}`, { headers });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error al obtener perfil especifico:", error);
      return null;
    }
  },

  // Actualiza los datos de un perfil
  async updateProfile(id: number, profileData: any) {
    const headers = getAuthHeaders();
    const url = `${BACKEND_URLS.PROFILE}/${id}`;
    
    // 🔥 EL ARREGLO: Detectar si es FormData (imágenes + texto) o JSON normal
    const isFormData = profileData instanceof FormData;
    
    if (isFormData) {
      // Si es FormData, borramos el Content-Type para que el navegador lo asigne automáticamente con el "boundary"
      delete headers["Content-Type"];
    }
    
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        // Si es FormData se envía directo, si es JSON se convierte a texto
        body: isFormData ? profileData : JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        
        // Sincronizar el localStorage (protegido para evitar errores de SSR en Next.js)
        if (typeof window !== "undefined") {
          const localUser = JSON.parse(localStorage.getItem("user") || "{}");
          const newUser = { ...localUser, ...updatedData };
          localStorage.setItem("user", JSON.stringify(newUser));
        }
        
        return updatedData;
      }
      return null;
    } catch (error) {
      console.error("Error en updateProfile:", error);
      return null;
    }
  }
};