import {
  LoginCredentials,
  LoginPayload,
  RegisterFormData,
} from "@/app/types/auth";

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
  if (password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres.";

  if (!/[A-Z]/.test(password))
    return "La contraseña debe incluir al menos una letra mayúscula.";

  if (!/[a-z]/.test(password))
    return "La contraseña debe incluir al menos una letra minúscula.";

  if (!/[0-9]/.test(password))
    return "La contraseña debe incluir al menos un número.";

  if (!/[!@#$%^&*.,_+\-=?]/.test(password))
    return "La contraseña debe incluir un carácter especial.";

  return null;
};

export const validateRegisterForm = (form: RegisterFormData): string | null => {
  if (!form.name || !form.email || !form.password) {
    return "Todos los campos son obligatorios.";
  }

  return validatePassword(form.password);
};
