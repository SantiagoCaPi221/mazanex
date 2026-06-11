export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
