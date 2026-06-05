"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/app/store/useUserStore";
import { authService } from "@/app/clients/authService";

import { LoginCredentials } from "@/app/components/types/auth";
import {
  buildLoginPayload,
  validateLoginForm,
} from "@/app/components/utils/login/auth";
export const useLogin = () => {
  const router = useRouter();
  const { login, showNotification } = useUserStore();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateLoginForm(credentials);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const payload = buildLoginPayload(credentials);
      const user = await authService.login(payload);

      if (!user) {
        setError("Usuario o contraseña incorrectos. Verifica tus datos.");
        return;
      }

      login(user);
      showNotification("¡Sesión iniciada con éxito!", "success");
      router.push("/pages/profile");
    } catch (error) {
      setError("Error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    error,
    isLoading,
    handleChange,
    handleLogin,
  };
};
