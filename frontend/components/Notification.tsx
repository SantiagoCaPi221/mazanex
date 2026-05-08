"use client";
import { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Notification = ({ message, type, onClose }: NotificationProps) => {
  // Efecto para que la notificación desaparezca sola tras 4 segundos
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Iniciamos la animación de salida a los 5.3 segundos
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 5300);

    // Cerramos el componente definitivamente a los 6 segundos
    const closeTimer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const styles: Record<"success" | "error", string> = {
    success: "bg-emerald-500 border-emerald-600",
    error: "bg-rose-500 border-rose-600",
  };

  return (
    <div
      className={`fixed top-5 right-5 z- flex items-center p-4 mb-4 w-full max-w-xs text-white rounded-xl shadow-2xl border-l-4 
      transition-all duration-700 ease-in-out transform 
      ${
        isExiting
          ? "opacity-0 translate-x-full"
          : "opacity-100 translate-x-0 animate-in slide-in-from-right-full"
      } 
      ${styles[type]}`}
    >
      <div className="ml-3 text-sm font-semibold tracking-wide">{message}</div>
      <button
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 text-white hover:bg-white/20 rounded-md transition-colors"
      >
        <span className="sr-only">Cerrar</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};
