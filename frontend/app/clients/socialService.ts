import { BACKEND_URLS } from "@/app/config/endpoints";
import type { Relationship } from "@/app/components/types/community";

const BASE_SOCIAL = `${BACKEND_URLS.PROFILE}/social`;

const getAuthHeaders = () => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
    const cleanToken = token.replace(/['"]+/g, '');
    headers["Authorization"] = `Bearer ${cleanToken}`;
  }
  
  return headers;
};

export const socialService = {
  async sendRequest(senderId: number, receiverId: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/send-request/${senderId}/${receiverId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async cancelRequest(senderId: number, receiverId: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/cancel-request/${senderId}/${receiverId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async acceptRequest(senderId: number, receiverId: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/accept-request/${senderId}/${receiverId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async removeFriend(userId: number, friendId: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/remove-friend/${userId}/${friendId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async getNotifications(userId: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/notifications/${userId}`, {
        headers: getAuthHeaders()
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },

  async markNotificationsAsRead(userId: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/notifications/${userId}/read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  async getRelationshipStatus(idA: number, idB: number): Promise<Relationship> {
    try {
      const response = await fetch(`${BASE_SOCIAL}/status/${idA}/${idB}`, {
        headers: getAuthHeaders() 
      });
      return response.ok ? await response.json() : { status: "NONE", isSender: false };
    } catch (error) {
      return { status: "NONE", isSender: false };
    }
  },

  async getPublicProfile(id: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/public/${id}`, {
          headers: getAuthHeaders() 
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  },

  async getFollowingIds(id: number) {
    try {
      const response = await fetch(`${BASE_SOCIAL}/following/${id}`, {
          headers: getAuthHeaders() 
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  },
};