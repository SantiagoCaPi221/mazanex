"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/app/clients/authService";
import type { ProfileUser } from "@/app/components/types/user";
import type { LoginCredentials, RegisterFormData } from "@/app/components/types/auth";

interface AuthContextType {
  user: ProfileUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app, revisamos si había un usuario guardado
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterFormData) => {
    const data = await authService.register(userData);
    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
