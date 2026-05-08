"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/service/authService";

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app, revisamos si había un usuario guardado
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);
    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return true;
    }
    return false;
  };

  const register = async (userData: any) => {
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
