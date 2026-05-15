"use client";

import Link from "next/link";

import LoginHeader from "../../components/comp_login/LoginHeader";
import LoginError from "../../components/comp_login/LoginError";
import LoginButton from "../../components/comp_login/LoginButton";
import LoginForm from "../../components/comp_login/LoginForm";

import { useLogin } from "../hooks/login/useLogin";

import { AUTH_MESSAGES } from "@/app/utils/message/loginMessages";

export default function LoginPage() {
  const { credentials, error, isLoading, handleChange, handleLogin } =
    useLogin();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6"
      >
        <LoginHeader />

        {error && <LoginError error={error} />}

        <LoginForm
          identifier={credentials.identifier}
          password={credentials.password}
          error={error}
          onChange={handleChange}
        />

        <LoginButton isLoading={isLoading} />

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            {AUTH_MESSAGES.noAccount}{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-bold hover:underline"
            >
              {AUTH_MESSAGES.registerFree}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
