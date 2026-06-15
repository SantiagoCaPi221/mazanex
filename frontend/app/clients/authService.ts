import { BACKEND_URLS } from "@/app/config/endpoints";

export const authService = {
  async register(userData: any) {
    const adaptedData = {
      name: userData.nombre || userData.name,
      email: userData.email,
      password: userData.password,
      role: "USER",
    };
    const response = await fetch(`${BACKEND_URLS.AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adaptedData),
    });
    return await response.json();
  },

  async login(credentials: any) {
    const response = await fetch(`${BACKEND_URLS.AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("authToken", data.accessToken);  // ← AGREGA ESTA LÍNEA
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    }
    return null;
  },

  async updatePassword(
    userId: number,
    passwordData: { currentPassword: string; newPassword: string }
  ) {
    const response = await fetch(`${BACKEND_URLS.AUTH}/${userId}/password`, {
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
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
    return null;
  },
};
