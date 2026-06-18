const BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";
//const BASE_URL = "http://localhost:8082";

export const profileService = {
  // 🔥 Ahora pedimos el token como tercer parámetro
  updateProfile: async (id: number, data: any, token?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Pasamos el token directamente desde Zustand
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Error en updateProfile:", response.status, response.statusText);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error de red en updateProfile:", error);
      return null;
    }
  },

  // 🔥 Lo mismo para syncProfile, recibe el token como segundo parámetro
  syncProfile: async (data: any, token?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error de red en syncProfile:", error);
      return null;
    }
  }
};