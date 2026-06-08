export const BACKEND_URLS = {
  // Apuntamos todo al Gateway. 
  // En local, el Gateway está corriendo en el puerto 8080.
  
  AUTH: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080/api/auth",

  PROFILE: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080/api/profile",

  PUBLICATIONS: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080/api/publications",

  RANKING: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080/api/ranking",
};