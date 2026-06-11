"use client";

import ProfileCard from "@/app/components/comp_profile/comp_profile_p/ProfileCard";
import { useProfile } from "@/app/components/hooks/profile/useProfile";

export default function ProfilePage() {
  const {
    user,
    name,
    bio,
    isEditing,
    loading,
    setName,
    setBio,
    setIsEditing,
    handleSave,
  } = useProfile();

  if (!user) return null;

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
