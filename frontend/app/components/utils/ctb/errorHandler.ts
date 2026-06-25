// @/app/components/utils/errorHandler.ts
import { AUTH_MESSAGES } from "@/app/components/utils/message/loginMessage";

export const handleAuthError = (error: any): string => {
  // 1. Acceso seguro a la respuesta del servidor
  const status = error?.response?.status;

  if (status) {
    // Usamos un objeto para mapear estados, es más limpio que un switch
    const errorMap: Record<number, string> = {
      400: AUTH_MESSAGES.errors.requiredFields,
      401: AUTH_MESSAGES.errors.invalidCredentials,
      // Puedes añadir más estados aquí según tu API (ej. 404, 500)
    };

    return errorMap[status] || AUTH_MESSAGES.errors.unexpected;
  }
  
  // 2. Errores de red
  if (error?.message === "Network Error") {
    return AUTH_MESSAGES.errors.networkError;
  }

  // 3. Fallback final
  return AUTH_MESSAGES.errors.unexpected;
};