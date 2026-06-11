export type UploadType = "avatarUrl" | "bannerUrl" | "backgroundUrl";

export interface ProfileUser {
  id: number;

  name: string;

  email: string;

  role?: string;

  bio?: string | null;

  avatarUrl?: string | null;

  bannerUrl?: string | null;

  backgroundUrl?: string | null;
}

export interface UpdateProfilePayload {
  name?: string;

  bio?: string;

  avatarUrl?: string;

  bannerUrl?: string;

  backgroundUrl?: string;
}

export interface ProfileMenuItem {
  name: string;

  href?: string;

  isDropdown?: boolean;

  subItems?: {
    name: string;
    href: string;
  }[];
}

export interface NotificationItem {
  id?: number;

  read?: boolean;

  isRead?: boolean;

  message?: string;
}
