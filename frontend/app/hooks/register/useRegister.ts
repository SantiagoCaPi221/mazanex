"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/service/authService";
import { useUserStore } from "@/store/useUserStore";

import { RegisterFormData } from "@/app/types/auth";
import { validateRegisterForm } from "@/app/utils/login/auth";

export const useRegister = () => {
  const router = useRouter();
  const { showNotification } = useUserStore();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateRegisterForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const success = await authService.register(formData);

      if (!success) {
        setError(
          "No se pudo crear la cuenta. Intenta con otro correo o revisa tus datos."
        );
        return;
      }

      showNotification(
        "¡Cuenta creada! Ahora puedes iniciar sesión.",
        "success"
      );

      router.push("/login");
    } catch (err) {
      setError("Error inesperado al registrar usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
