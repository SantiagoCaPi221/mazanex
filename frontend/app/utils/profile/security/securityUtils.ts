import { PasswordForm } from "@/app/types/security";

export function validatePassword(pass: PasswordForm) {
  if (pass.new === pass.current) {
    return {
      valid: false,
      message: "La nueva contraseña no puede ser igual a la actual.",
    };
  }

  if (pass.new.length < 6) {
    return {
      valid: false,
      message: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  return {
    valid: true,
  };
}
