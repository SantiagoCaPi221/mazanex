"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { profileService } from "@/app/clients/profileService";
import { User } from "@/app/components/types/user";

export const useProfile = () => {
  const { user, setUser, showNotification } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);

  // Sincroniza store → inputs locales
  useEffect(() => {
    if (user) {
      // 🔥 Ajuste clave: Buscamos el usuario real por si viene anidado con el token
      const realUser = user.user || user;
      
      setName(realUser.name || "");
      setBio((realUser as any).bio || ""); // si bio no está en User aún
    }
  }, [user]);

  const handleSave = async () => {
    console.log("1. Botón clickeado. Datos actuales:", { name, bio });
    console.log("2. Objeto user completo:", user);

    // 🔥 Buscamos el ID en la raíz o dentro del objeto anidado
    const realUserId = user?.id || user?.user?.id;

    if (!realUserId) {
      console.error("🚨 ERROR SILENCIOSO: user.id no existe o es undefined.");
      showNotification("Error interno: Usuario sin ID", "error");
      return; 
    }

    setLoading(true);
    console.log("3. Pasó la validación. Iniciando petición con ID:", realUserId);

    try {
      // Extraemos los datos reales del usuario evitando enviar el token en el body
      const realUserObject = user?.user || user;

      const updatedUser = {
        ...realUserObject,
        name,
        bio, 
      } as User;

      // 🔥 Rescatamos el token de Zustand
      const token = user?.token;
      
      console.log("🛠️ Token listo para enviar:", token ? "¡Token encontrado!" : "No hay token");

      // 🔥 ¡AQUÍ ESTABA LA TRAMPA! Ahora pasamos el token como 3er parámetro
      const result = await profileService.updateProfile(realUserId, updatedUser, token);
      console.log("4. Respuesta del backend:", result);

      if (!result) {
        showNotification("Error al actualizar el perfil", "error");
        return;
      }

      // Actualizamos el store manteniendo la estructura anidada si existe
      setUser(user?.token ? { ...user, user: result } : result);
      setIsEditing(false);

      showNotification("Perfil actualizado correctamente", "success");
    } catch (error) {
      console.error("5. Cayó en el catch:", error);
      showNotification("Error inesperado al actualizar", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    name,
    bio,
    isEditing,
    loading,
    setName,
    setBio,
    setIsEditing,
    handleSave,
  };
};