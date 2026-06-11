import { BACKEND_URLS } from "@/app/config/endpoints";

export const publicationService = {
  // 1. Obtener el Feed Global (Muro principal)
  async getFeed() {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/feed`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error al cargar el feed:", error);
      return [];
    }
  },

  // 2. Obtener las publicaciones de un usuario específico (Para su perfil)
  async getUserPublications(userId: number) {
    try {
      const response = await fetch(
        `${BACKEND_URLS.PUBLICATIONS}/user/${userId}`
      );
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error al cargar las publicaciones del usuario:", error);
      return [];
    }
  },

  // 3. Crear una nueva publicación
  async createPublication(publicationData: any) {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publicationData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      return null;
    }
  },

  // 4. Dar/Quitar Like a una publicación
  async toggleLike(publicationId: number, userId: number) {
    try {
      const response = await fetch(
        `${BACKEND_URLS.PUBLICATIONS}/${publicationId}/like/${userId}`,
        {
          method: "POST",
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error al dar like:", error);
      return false;
    }
  },

  // 5. Agregar un comentario
  async addComment(publicationId: number, commentData: any) {
    try {
      const response = await fetch(
        `${BACKEND_URLS.PUBLICATIONS}/${publicationId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentData),
        }
      );
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error al comentar:", error);
      return null;
    }
  },

  // 6. Eliminar una publicación (Opcional)
  async deletePublication(publicationId: number) {
    try {
      const response = await fetch(
        `${BACKEND_URLS.PUBLICATIONS}/${publicationId}`,
        {
          method: "DELETE",
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      return false;
    }
  },
};
