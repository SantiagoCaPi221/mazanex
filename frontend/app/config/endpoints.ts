export const BACKEND_URLS = {
  // Las URLs de producción en Railway, con fallback a tus puertos locales (8081, 8082, 8083, 8084)
  AUTH: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8081/api/auth",

  PROFILE:
    process.env.NEXT_PUBLIC_PROFILE_URL || "http://localhost:8082/api/profile",

  PUBLICATIONS:
    process.env.NEXT_PUBLIC_PUBLICATIONS_URL ||
    "http://localhost:8083/api/publications",

  RANKING:
    process.env.NEXT_PUBLIC_RANKING_URL || "http://localhost:8084/api/ranking",
};
