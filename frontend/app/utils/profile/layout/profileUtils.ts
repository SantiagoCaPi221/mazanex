export type UploadType = "avatarUrl" | "bannerUrl" | "backgroundUrl";

export function getInitials(name?: string): string {
  return name?.substring(0, 2).toUpperCase() || "??";
}

export function getUsername(name?: string): string {
  return name?.replace(/\s+/g, "").toLowerCase() || "";
}

export function getUploadLabel(type: UploadType): string {
  const labels: Record<UploadType, string> = {
    avatarUrl: "Foto de perfil",
    bannerUrl: "Banner",
    backgroundUrl: "Fondo global",
  };

  return labels[type];
}
