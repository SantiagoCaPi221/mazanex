import { BACKEND_URLS } from "@/app/config/endpoints";

export const authService = {
  async register(userData: any) {
    const adaptedData = {
      name: userData.nombre || userData.name,
      email: userData.email,
      password: userData.password,
      role: "USER",
    };

    // ==========================================
    // PASO 1: Crear la cuenta en ms-auth
    // ==========================================
    const authResponse = await fetch(`${BACKEND_URLS.AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adaptedData),
    });

    // Si falla el registro (ej. correo ya existe), cortamos aquí y devolvemos null
    // para que useRegister muestre el error.
    if (!authResponse.ok) {
      return null; 
    }

    const newUser = await authResponse.json();

    // ==========================================
    // PASO 2: Sincronizar creando la ficha en ms-profile
    // ==========================================
    try {
      // Asumimos que tienes PROFILE configurado en tus BACKEND_URLS
      // Si no, puedes usar directamente "http://localhost:8080/api/profile"
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
      // Si esto falla, no rompemos el registro, solo avisamos en consola
      console.warn("Cuenta creada, pero falló la sincronización con el perfil:", error);
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
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};