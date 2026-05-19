const GATEWAY_AUTH = "/api/gateway/auth";

export const authService = {
  async register(userData: any) {
    const adaptedData = {
      name: userData.nombre || userData.name,
      email: userData.email,
      password: userData.password,
      role: "USER",
    };
    const response = await fetch(`${GATEWAY_AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adaptedData),
    });
    return await response.json();
  },

  async login(credentials: any) {
    const response = await fetch(`${GATEWAY_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    }
    return null;
  },

  async updatePassword(
    userId: number,
    passwordData: { currentPassword: string; newPassword: string }
  ) {
    const response = await fetch(`${GATEWAY_AUTH}/${userId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error("Contraseña incorrecta o error en el servidor");
    }
    return await response.json();
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};
