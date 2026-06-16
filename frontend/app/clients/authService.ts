import { BACKEND_URLS } from "@/app/config/endpoints";

export const authService = {
  async register(userData: any) {
    const adaptedData = {
      name: userData.nombre || userData.name,
      email: userData.email,
      password: userData.password,
      role: "USER",
    };

    const authResponse = await fetch(`${BACKEND_URLS.AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adaptedData),
    });

    if (!authResponse.ok) return null;

    const newUser = await authResponse.json();

    try {
      await fetch(`${BACKEND_URLS.PROFILE}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newUser.id,
          name: adaptedData.name,
          bio: "¡Nuevo en la comunidad Mazanex!",
        }),
      });
    } catch (error) {
      console.warn("Fallo en sincronización de perfil:", error);
    }

    return newUser;
  },

  async login(credentials: any) {
    const response = await fetch(`${BACKEND_URLS.AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const data = await response.json();
      // data.token es el JWT que viene del backend
      localStorage.setItem("user", JSON.stringify(data.user || data));
      localStorage.setItem("token", data.token); 
      return data;
    }
    return null;
  },

  getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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