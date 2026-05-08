"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { useUserStore } from "@/store/useUserStore";
import { AuthProvider } from "@/context/AuthContext";
import { PerfilProvider } from "@/context/PerfilContext";
import { Notification } from "@/components/Notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notification, hideNotification } = useUserStore();

  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <PerfilProvider>
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
          </PerfilProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
