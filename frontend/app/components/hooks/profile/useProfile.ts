"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { profileService } from "@/app/clients/profileService";

export const useProfile = () => {
  const { user, setUser, showNotification } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const realUser = user?.user || user;

  useEffect(() => {
    if (!realUser) return;
    setName(realUser.name || "");
    setBio((realUser as any).bio || "");
  }, [realUser]);

  const handleSave = async () => {
    if (!realUser?.id) {
      if (showNotification) showNotification("Usuario sin ID", "error");
      return;
    }

    setLoading(true);

    try {
      // 🔥 LÓGICA INTELIGENTE: Si hay archivos, usamos FormData (multipart/form-data).
      // Si solo hay texto, enviamos JSON puro para evitar el error 415.
      let payload: any;
      
      if (avatarFile || bannerFile) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        if (avatarFile) formData.append("avatar", avatarFile);
        if (bannerFile) formData.append("banner", bannerFile);
        payload = formData;
      } else {
        payload = { name, bio };
      }

      const result = await profileService.updateProfile(realUser.id, payload);

      if (!result) {
        if (showNotification) showNotification("Error al actualizar perfil", "error");
        return;
      }

      // Merge correcto en el estado global
      const isNested = !!user?.user;
      setUser(
        isNested
          ? { ...user, user: { ...realUser, ...result } }
          : { ...realUser, ...result }
      );

      setAvatarFile(null);
      setBannerFile(null);
      setIsEditing(false);

      if (showNotification) showNotification("Perfil actualizado con éxito", "success");
    } catch (err) {
      console.error(err);
      if (showNotification) showNotification("Error inesperado al guardar", "error");
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
    setAvatarFile,
    setBannerFile,
    handleSave,
  };
};