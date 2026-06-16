const GATEWAY_SOCIAL = "/api/gateway/profile/social";

export const socialService = {
  async sendRequest(senderId: number, receiverId: number) {
    try {
      const response = await fetch(
        `${GATEWAY_SOCIAL}/send-request/${senderId}/${receiverId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async cancelRequest(senderId: number, receiverId: number) {
    try {
      const response = await fetch(
        `${GATEWAY_SOCIAL}/cancel-request/${senderId}/${receiverId}`,
        {
          method: "DELETE",
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async acceptRequest(senderId: number, receiverId: number) {
    try {
      const response = await fetch(
        `${GATEWAY_SOCIAL}/accept-request/${senderId}/${receiverId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async removeFriend(userId: number, friendId: number) {
    try {
      const response = await fetch(
        `${GATEWAY_SOCIAL}/remove-friend/${userId}/${friendId}`,
        {
          method: "DELETE",
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async getNotifications(userId: number) {
    try {
      const response = await fetch(`${GATEWAY_SOCIAL}/notifications/${userId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async markNotificationsAsRead(userId: number) {
    try {
      const response = await fetch(
        `${GATEWAY_SOCIAL}/notifications/${userId}/read`,
        {
          method: "PUT",
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async getRelationshipStatus(idA: number, idB: number) {
    try {
      const response = await fetch(`${GATEWAY_SOCIAL}/status/${idA}/${idB}`);
      if (!response.ok) return { status: "NONE", isSender: false };
      return await response.json();
    } catch (error) {
      return { status: "NONE", isSender: false };
    }
  },

  async getPublicProfile(id: number) {
    try {
      const response = await fetch(`${GATEWAY_SOCIAL}/public/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  async getFollowingIds(id: number) {
    try {
      const response = await fetch(`${GATEWAY_SOCIAL}/following/${id}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },
};
