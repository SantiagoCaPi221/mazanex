"use client";

import { useState } from "react";

import { profileService } from "@/service/profileService";

import { ProfileUser, UploadType } from "@/app/types/user";

interface ShowNotification {
  (message: string, type?: "success" | "error"): void;
}

export function useProfileUpload(
  user: ProfileUser | null,
  setUser: (user: ProfileUser | null) => void,
  showNotification: ShowNotification
) {
  const [loading, setLoading] = useState(false);

  const upload = async (file: File, type: UploadType) => {
    if (file.size > 3 * 1024 * 1024) {
      showNotification("La imagen es demasiado pesada (Máx 3MB)", "error");

      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      if (!user) return;

      const data = await profileService.updateProfile(user.id, {
        id: user.id,
        [type]: reader.result,
      });

      if (data) {
        setUser(data);

        showNotification("Actualizado con éxito", "success");
      } else {
        showNotification("Error al subir imagen", "error");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return {
    upload,
    loading,
  };
}
