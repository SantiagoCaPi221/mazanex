"use client";

import ProfileCard from "@/components/comp_profile/comp_profile_p/ProfileCard";
import { useProfile } from "../hooks/profile/useProfile";

export default function ProfilePage() {
  const {
    user,
    name,
    setName,
    bio,
    setBio,
    isEditing,
    setIsEditing,
    handleSave,
    loading,
  } = useProfile();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        Cargando perfil...
      </div>
    );
  }

  return (
    <ProfileCard
      user={user}
      name={name}
      setName={setName}
      bio={bio}
      setBio={setBio}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      handleSave={handleSave}
      loading={loading}
    />
  );
}
