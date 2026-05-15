"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/service/authService";
import { useUserStore } from "@/store/useUserStore";

import { LoginCredentials } from "../../types/auth";
import { buildLoginPayload } from "../../utils/login/auth";
import { validateLoginFields } from "../../utils/login/validation";

import { AUTH_MESSAGES } from "@/app/utils/message/loginMessages";

export function useLogin() {
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

    const isValid = validateLoginFields(credentials);

    if (!isValid) {
      setError(AUTH_MESSAGES.errors.requiredFields);
      return;
    }

    setIsLoading(true);

    try {
      const payload = buildLoginPayload(credentials);

      const user = await authService.login(payload);

      if (user) {
        login(user);

        showNotification(AUTH_MESSAGES.loginSuccess, "success");

        router.push("/profile");
      } else {
        setError(AUTH_MESSAGES.errors.invalidCredentials);
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(AUTH_MESSAGES.errors.unexpected);
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
}
