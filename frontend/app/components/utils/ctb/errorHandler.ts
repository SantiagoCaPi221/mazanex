// frontend/app/components/utils/ctb/errorHandler.ts
export const handleApiError = (error: any, fallback = "Ocurrió un error inesperado."): string => {
  const status = error?.response?.status;

  if (status) {
    const errorMap: Record<number, string> = {
      400: "Revisa los datos enviados.",
      401: "No tienes permisos para realizar esta acción.",
      403: "No tienes permiso para esta acción.",
      404: "No se encontró el recurso solicitado.",
      409: "Ya existe un registro con esos datos.",
      422: "Los datos enviados no son válidos.",
      500: "Hubo un problema en el servidor. Intenta más tarde.",
    };

    return errorMap[status] || fallback;
  }

  if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
    return "No se pudo conectar con el servidor. Revisa tu conexión.";
  }

  return fallback;
};