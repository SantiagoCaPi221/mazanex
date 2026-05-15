"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { useUserStore } from "@/store/useUserStore";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { Notification } from "@/components/Notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
