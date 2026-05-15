"use client";

import RegisterCard from "../../components/comp_register/RegisterCard";

import { useRegister } from "../hooks/register/useRegister";

export default function RegisterPage() {
  const {
    formData,

    error,

    isLoading,

    handleChange,

    handleSubmit,
  } = useRegister();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <RegisterCard
        formData={formData}
        error={error}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </div>
  );
}
