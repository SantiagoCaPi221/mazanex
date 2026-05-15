"use client";

import { useRef, useMemo } from "react";
import { usePathname } from "next/navigation";

import { useUserStore } from "@/store/useUserStore";

import { useNotifications } from "@/app/hooks/profile/profile_layout/useNotifications";
import { useProfileUI } from "@/app/hooks/profile/profile_layout/useProfileUI";
import { useProfileUpload } from "@/app/hooks/profile/profile_layout/useProfileUpload";

import ProfileBackground from "@/components/comp_profile/comp_profile_layout/ProfileBackground";
import ProfileTopActions from "@/components/comp_profile/comp_profile_layout/ProfileTopActions";
import ProfileBanner from "@/components/comp_profile/comp_profile_layout/ProfileBanner";
import ProfileAvatar from "@/components/comp_profile/comp_profile_layout/ProfileAvatar";
import ProfileSidebar from "@/components/comp_profile/comp_profile_layout/ProfileSidebar";

import {
  MENU_ITEMS,
  DEFAULT_BACKGROUND,
} from "@/app/utils/profile_layout/profileConstants";

import { getUsername } from "@/app/utils/profile_layout/profileHelpers";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, showNotification } = useUserStore();
  const pathname = usePathname();

  const { isGamesOpen, setIsGamesOpen, isProfileVisible, setIsProfileVisible } =
    useProfileUI(pathname);

  const { unreadCount } = useNotifications(user?.id ?? null, pathname);

  const { upload } = useProfileUpload(user, setUser, showNotification);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const backgroundUrl = useMemo(
    () => user?.backgroundUrl || DEFAULT_BACKGROUND,
    [user?.backgroundUrl]
  );

  const username = useMemo(() => getUsername(user?.name ?? ""), [user?.name]);

  if (!user) return null;

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full py-16 md:py-24">
      <ProfileBackground
        backgroundUrl={backgroundUrl}
        isProfileVisible={isProfileVisible}
      />

      <ProfileTopActions
        isProfileVisible={isProfileVisible}
        setIsProfileVisible={setIsProfileVisible}
        backgroundInputRef={backgroundInputRef}
        upload={upload}
      />

      <div
        className={`relative z-10 max-w-[1000px] mx-auto px-4 transition-all duration-700 transform ${
          isProfileVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 min-h-[80vh] flex flex-col">
          <ProfileBanner
            bannerUrl={user.bannerUrl}
            bannerInputRef={bannerInputRef}
            upload={upload}
          />

          <div className="pt-24 pb-16 px-12 relative flex-1">
            <ProfileAvatar
              avatarUrl={user.avatarUrl}
              username={user.name}
              avatarInputRef={avatarInputRef}
              upload={upload}
            />

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 h-full">
              <ProfileSidebar
                username={user.name}
                formattedUsername={username}
                bio={user.bio}
                menu={MENU_ITEMS}
                pathname={pathname}
                unreadCount={unreadCount}
                isGamesOpen={isGamesOpen}
                setIsGamesOpen={setIsGamesOpen}
              />

              <main className="min-h-[450px] h-full flex flex-col">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
