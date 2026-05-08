const API_GATEWAY_URL = "/api/gateway/perfil";

export const perfilService = {
  async actualizarPerfil(id: number, userData: any) {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/perfil/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.error("Error del servidor:", response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error de red en perfilService:", error);
      return null;
    }
  },
};
