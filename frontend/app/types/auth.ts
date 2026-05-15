export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;

  avatarUrl?: string | null;
  bannerUrl?: string | null;
  backgroundUrl?: string | null;

  bio?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}
