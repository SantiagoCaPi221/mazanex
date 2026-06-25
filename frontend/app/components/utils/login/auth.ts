import {
  LoginCredentials,
  LoginPayload,
  RegisterFormData,
} from "@/app/components/types/auth";

import { AUTH_MESSAGES } from "@/app/components/utils/message/loginMessage";

/* =========================
   LOGIN
========================= */

export const buildLoginPayload = (
  credentials: LoginCredentials
): LoginPayload => {
  return {
    email: credentials.identifier,
    password: credentials.password,
  };
};

export const validateLoginForm = (
  credentials: LoginCredentials
): string | null => {
  if (!credentials.identifier || !credentials.password) {
    return "Por favor, completa todos los campos.";
  }
  return null;
};

/* =========================
   REGISTER
========================= */

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return AUTH_MESSAGES.validation.shortPassword;
  if (!/[A-Z]/.test(password)) return AUTH_MESSAGES.validation.missingUpper;
  if (!/[a-z]/.test(password)) return AUTH_MESSAGES.validation.missingLower;
  if (!/[0-9]/.test(password)) return AUTH_MESSAGES.validation.missingNumber;
  if (!/[!@#$%^&*.,_+\-=?]/.test(password)) return AUTH_MESSAGES.validation.missingSpecial;
  return null;
};

export const validateRegisterForm = (form: RegisterFormData): string | null => {
  if (!form.name || !form.email || !form.password) {
    return "Todos los campos son obligatorios.";
  }

  return validatePassword(form.password);
};
