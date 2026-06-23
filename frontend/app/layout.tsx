"use client";

import "./globals.css";
import Navbar from "@/app/components/comp_page/Navbar";
import { useUserStore } from "@/app/store/useUserStore";
import { AuthProvider } from "@/app/context/AuthContext";
import { ProfileProvider } from "@/app/context/ProfileContext";
import { Notification } from "@/app/components/comp_page/Notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Solo conservamos el estado de las notificaciones
  const { notification, hideNotification } = useUserStore();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900" suppressHydrationWarning>
        <AuthProvider>
          <ProfileProvider>
            {notification && (
              <Notification
                key={notification.message}
                message={notification.message}
                type={notification.type as "success" | "error"}
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