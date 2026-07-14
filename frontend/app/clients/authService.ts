import { BACKEND_URLS } from "@/app/config/endpoints";
import type { AuthResponse, RegisterFormData } from "@/app/components/types/auth";
import type { ProfileUser } from "@/app/components/types/user";

export const authService = {
  async register(userData: RegisterFormData): Promise<ProfileUser | null> {
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
      // Corregido: URL limpia sin duplicar /api/profile
      await fetch(`${BACKEND_URLS.PROFILE}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newUser.id, // Asegúrate que tu backend reciba 'id' y no 'userId' según tu modelo
          name: adaptedData.name,
          email: adaptedData.email,
          bio: "¡Nuevo en la comunidad Mazanex!",
        }),
      });
    } catch (error) {
      console.warn("Fallo en sincronización de perfil:", error);
    }

    return newUser;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${BACKEND_URLS.AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      let user = data.user || data;

      // 🔥 HIDRATACIÓN DE PERFIL: Obtenemos datos completos (Bio, imágenes)
      try {
        // Corregido: URL limpia, sin el doble '/api/profile/'
        const profileUrl = `${BACKEND_URLS.PROFILE}/${user.id}`;
        
        const profileResponse = await fetch(profileUrl, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          // Combinamos datos: Auth (ID/Email) + Profile (Bio/Imágenes)
          user = { ...user, ...profileData };
        }
      } catch (err) {
        console.warn("No se pudo cargar el perfil completo, usando datos básicos", err);
      }

      // Guardado persistente
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token); 
      
      return { user, token };
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