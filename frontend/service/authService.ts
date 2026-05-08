const API_GATEWAY_URL = "/api/gateway/auth";

export const authService = {
  async register(userData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.ok ? await response.json() : null;
  },

  async login(credentials: any) {
    const response = await fetch(`${API_GATEWAY_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.ok ? await response.json() : null;
  },

  // ESTA ES LA FUNCIÓN QUE TE FALTA O ESTÁ MAL UBICADA
  async actualizarPassword(id: number, userData: any) {
    try {
      // Nota: '/perfil' debe coincidir con el @PutMapping de tu Java en Railway
      const response = await fetch(`${API_GATEWAY_URL}/perfil/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error en el Gateway al cambiar clave:", error);
      return null;
    }
  },
};
