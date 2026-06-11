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
      setName(user.name || "");
      setBio((user as any).bio || ""); // si bio no está en User aún
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const updatedUser: User = {
        ...user,
        name,
      };

      const result = await profileService.updateProfile(user.id, updatedUser);

      if (!result) {
        showNotification("Error al actualizar el perfil", "error");
        return;
      }

      setUser(result);
      setIsEditing(false);

      showNotification("Perfil actualizado correctamente", "success");
    } catch (error) {
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
