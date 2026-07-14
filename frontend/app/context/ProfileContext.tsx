"use client";
import React, { createContext, useContext, useState } from "react";
import { profileService } from "@/app/clients/profileService";
import type { ProfileUser, UpdateProfilePayload } from "@/app/components/types/user";

interface ProfileContextType {
  profile: ProfileUser | null;
  syncProfile: (userData: UpdateProfilePayload) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<ProfileUser | null>(null);

  const syncProfile = async (userData: UpdateProfilePayload) => {
    if (data) {
      setProfile(data);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, syncProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile debe usarse dentro de ProfileProvider");
  return context;
};
