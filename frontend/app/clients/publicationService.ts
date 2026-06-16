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

export const publicationService = {
  async getFeed() {
    const headers = getAuthHeaders();
    console.log("🚀 Enviando GET /feed con headers:", headers);
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/feed`, { headers });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },

  async getUserPublications(userId: number) {
    const headers = getAuthHeaders();
    console.log(`🚀 Enviando GET /user/${userId} con headers:`, headers);
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/user/${userId}`, { headers });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },

  async createPublication(publicationData: any) {
    const headers = getAuthHeaders();
    console.log("🚀 Enviando POST /publications con headers:", headers);
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}`, {
        method: "POST",
        headers,
        body: JSON.stringify(publicationData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async toggleLike(publicationId: number, userId: number) {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/${publicationId}/like`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: userId }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async addComment(publicationId: number, commentData: any) {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/${publicationId}/comment`, {
        method: "POST",
        headers,
        body: JSON.stringify(commentData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async deletePublication(publicationId: number) {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${BACKEND_URLS.PUBLICATIONS}/${publicationId}`, {
        method: "DELETE",
        headers,
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
};