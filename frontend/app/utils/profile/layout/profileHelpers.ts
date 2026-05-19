import { UploadType } from "@/app/types/profile";

export function getInitials(name?: string): string {
  return name?.substring(0, 2).toUpperCase() || "??";
}

export function getUsername(name?: string): string {
  return name?.replace(/\s+/g, "").toLowerCase() || "";
}

export function getUploadLabel(type: UploadType): string {
  switch (type) {
    case "avatarUrl":
      return "Foto de perfil";

    case "bannerUrl":
      return "Banner";

    default:
      return "Fondo global";
  }
}
