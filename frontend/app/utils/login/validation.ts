import { LoginCredentials, RegisterData } from "@/app/types/auth";

export function validateLoginFields(data: LoginCredentials) {
  return data.identifier.trim() !== "" && data.password.trim() !== "";
}

export function validateRegisterFields(data: RegisterData) {
  return (
    data.name.trim() !== "" &&
    data.email.trim() !== "" &&
    data.password.trim() !== ""
  );
}

export function passwordsMatch(password: string, confirmPassword?: string) {
  return password === confirmPassword;
}
