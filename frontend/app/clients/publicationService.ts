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

export const publicationService = {
  async getFeed() {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/feed`, {
        headers: getAuthHeaders() 
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },

  async getUserPublications(userId: number) {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/user/${userId}`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },

  async createPublication(publicationData: any) {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(publicationData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async toggleLike(publicationId: number, userId: number) {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/${publicationId}/like`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: userId }) 
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async addComment(publicationId: number, commentData: any) {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/${publicationId}/comment`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(commentData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async deletePublication(publicationId: number) {
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/${publicationId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
};