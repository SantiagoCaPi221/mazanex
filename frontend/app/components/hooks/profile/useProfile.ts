"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { profileService } from "@/app/clients/profileService";
import { handleApiError } from "@/app/components/utils/ctb/errorHandler";

export const useProfile = () => {
  const { user, setUser, showNotification } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const realUser = user?.user || user;
  const token = user?.token;

  // sync store → inputs
  useEffect(() => {
    if (!realUser) return;

    setName(realUser.name || "");
    setBio((realUser as any).bio || "");
  }, [user]);

  const handleSave = async () => {
    if (!realUser?.id) {
      showNotification("Usuario sin ID", "error");
      return;
    }

    setLoading(true);

    try {
      // 🔥 SOLO CAMPOS MODIFICADOS
      const formData = new FormData();

      formData.append("name", name);
      formData.append("bio", bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const result = await profileService.updateProfile(
        realUser.id,
        formData,
      );

      if (!result) {
        showNotification("Error al actualizar perfil", "error");
        return;
      }

      // 🔥 merge correcto (NO pisar imágenes)
      setUser({
        ...user,
        user: {
          ...realUser,
          ...result,
        },
      });

      setAvatarFile(null);
      setBannerFile(null);
      setIsEditing(false);

      showNotification("Perfil actualizado", "success");
    } catch (err) {
      console.error(err);
      showNotification(
        handleApiError(err, "Error inesperado al actualizar el perfil."),
        "error"
      );
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