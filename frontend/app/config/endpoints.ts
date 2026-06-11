// Capturamos la URL base una sola vez
const BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

export const BACKEND_URLS = {
  // Concatenamos la base con la ruta específica de cada API
  AUTH: `${BASE_URL}/api/auth`,
  PROFILE: `${BASE_URL}/api/profile`,
  PUBLICATIONS: `${BASE_URL}/api/publications`,
  RANKING: `${BASE_URL}/api/ranking`,
};