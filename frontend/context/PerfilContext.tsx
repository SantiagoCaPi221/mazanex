"use client";
import React, { createContext, useContext, useState } from "react";
import { perfilService } from "@/service/perfilService";

interface PerfilContextType {
  perfil: any;
  sincronizarPerfil: (userData: any) => Promise<void>;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfil, setPerfil] = useState<any>(null);

  const sincronizarPerfil = async (userData: any) => {
    const data = await perfilService.sincronizarConBackend(userData);
    if (data) {
      setPerfil(data);
    }
  };

  return (
    <PerfilContext.Provider value={{ perfil, sincronizarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context)
    throw new Error("usePerfil debe usarse dentro de PerfilProvider");
  return context;
};
