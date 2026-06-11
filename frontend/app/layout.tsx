"use client";

import { useEffect } from "react";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { useUserStore } from "@/app/store/useUserStore";
import { AuthProvider } from "@/app/context/AuthContext";
import { ProfileProvider } from "@/app/context/ProfileContext";
import { Notification } from "@/app/components/Notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Extraemos user y login de tu estado global
  const { notification, hideNotification, user, login } = useUserStore();

  // 2. Inyectamos la sesión falsa automáticamente
  useEffect(() => {
    if (!user) {
      login({
        id: 1,
        name: "Bruno Stockle",
        email: "bruno@mazanex.com",
        role: "USER",
      });
    }
  }, [user, login]);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900" suppressHydrationWarning>
        <AuthProvider>
          <ProfileProvider>
            {notification && (
              <Notification
                key={notification.message}
                message={notification.message}
                type={notification.type}
                onClose={hideNotification}
              />
            )}
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
