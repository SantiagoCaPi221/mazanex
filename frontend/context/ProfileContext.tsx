"use client";
import React, { createContext, useContext, useState } from "react";
import { profileService } from "@/service/profileService";

interface ProfileContextType {
  profile: any;
  syncProfile: (userData: any) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<any>(null);

  const syncProfile = async (userData: any) => {
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
