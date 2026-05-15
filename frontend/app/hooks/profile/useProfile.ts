"use client";

import { useEffect, useState } from "react";

import { useUserStore } from "@/store/useUserStore";

import { profileService } from "@/service/profileService";

import { getInitialProfileForm } from "../../utils/profile/profileUtils";

import { PROFILE_MESSAGES } from "@/app/utils/message/profileMessages";

export function useProfile() {
  const { user, setUser, showNotification } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [bio, setBio] = useState("");

  useEffect(() => {
    const initial = getInitialProfileForm(user);

    setName(initial.name);
    setBio(initial.bio);
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);

    const updatedData = {
      name,
      bio,
    };

    const result = await profileService.updateProfile(user.id, updatedData);

    if (result) {
      setUser(result);

      setIsEditing(false);

      showNotification(PROFILE_MESSAGES.uploadSuccess, "success");
    } else {
      showNotification(PROFILE_MESSAGES.uploadError, "error");
    }

    setLoading(false);
  };

  return {
    user,
    name,
    setName,
    bio,
    setBio,
    isEditing,
    setIsEditing,
    loading,
    handleSave,
  };
}
