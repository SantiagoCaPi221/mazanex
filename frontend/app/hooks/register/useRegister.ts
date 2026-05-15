"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { authService } from "@/service/authService";

import { useUserStore } from "@/store/useUserStore";

import { RegisterData } from "../../types/auth";

import { validateRegisterFields } from "../../utils/login/validation";

import { buildRegisterPayload } from "../../utils/login/auth";

export function useRegister() {
  const router = useRouter();

  const { showNotification } = useUserStore();

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const isValid = validateRegisterFields(formData);

    if (!isValid) {
      setError("Please complete all fields.");

      return;
    }

    setIsLoading(true);

    try {
      const payload = buildRegisterPayload(formData);

      const success = await authService.register(payload);

      if (success) {
        showNotification("Account created successfully!", "success");

        router.push("/login");
      } else {
        setError("Could not create account.");
      }
    } catch (error) {
      console.error("Register error:", error);

      setError("Unexpected error occurred.");
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
}
