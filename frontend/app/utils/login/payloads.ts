import {
    LoginCredentials,
    RegisterData,
  } from "@/app/types/auth";
  
  export function buildLoginPayload(
    data: LoginCredentials
  ) {
    return {
      email: data.identifier,
      password: data.password,
    };
  }
  
  export function buildRegisterPayload(
    data: RegisterData
  ) {
    return {
      name: data.name,
      email: data.email,
      password: data.password,
    };
  }