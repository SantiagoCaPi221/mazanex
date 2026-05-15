"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";

/* STORE */
import { useUserStore } from "@/store/useUserStore";

/* HOOKS */
import { useNotifications } from "@/app/hooks/profile/layout/useNotifications";
import { useProfileUI } from "@/app/hooks/profile/layout/useProfileUI";
import { useProfileUpload } from "@/app/hooks/profile/layout/useProfileUpload";

/* COMPONENTS */
import ProfileBackground from "@/components/comp_profile/comp_profile_layout/ProfileBackground";
import ProfileTopActions from "@/components/comp_profile/comp_profile_layout/ProfileTopActions";
import ProfileBanner from "@/components/comp_profile/comp_profile_layout/ProfileBanner";
import ProfileAvatar from "@/components/comp_profile/comp_profile_layout/ProfileAvatar";
import ProfileSidebar from "@/components/comp_profile/comp_profile_layout/ProfileSidebar";

/* UTILS */
import {
  MENU_ITEMS,
  DEFAULT_BACKGROUND,
} from "@/app/utils/profile/layout/profileConstants";

import { getUsername } from "@/app/utils/profile/layout/profileHelpers";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, showNotification } = useUserStore();

  const pathname = usePathname();

  /* HOOKS */
  const { isGamesOpen, setIsGamesOpen, isProfileVisible, setIsProfileVisible } =
    useProfileUI(pathname);

  const { unreadCount } = useNotifications(user?.id ?? null, pathname);

  const { upload } = useProfileUpload(user, setUser, showNotification);

  /* INPUT REFS */
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);

  const backgroundInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full py-16 md:py-24">
      {/* BACKGROUND */}
      <ProfileBackground
        backgroundUrl={user.backgroundUrl || DEFAULT_BACKGROUND}
        isProfileVisible={isProfileVisible}
      />

      {/* TOP ACTIONS */}
      <ProfileTopActions
        isProfileVisible={isProfileVisible}
        setIsProfileVisible={setIsProfileVisible}
        backgroundInputRef={backgroundInputRef}
        upload={upload}
      />

      {/* MAIN CONTAINER */}
      <div
        className={`relative z-10 max-w-[1000px] mx-auto px-4 transition-all duration-700 transform ${
          isProfileVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 min-h-[80vh] flex flex-col">
          {/* BANNER */}
          <ProfileBanner
            bannerUrl={user.bannerUrl}
            bannerInputRef={bannerInputRef}
            upload={upload}
          />

          {/* CONTENT */}
          <div className="pt-24 pb-16 px-12 relative flex-1">
            {/* AVATAR */}
            <ProfileAvatar
              avatarUrl={user.avatarUrl}
              username={user.name}
              avatarInputRef={avatarInputRef}
              upload={upload}
            />

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 h-full">
              {/* SIDEBAR */}
              <ProfileSidebar
                username={user.name}
                formattedUsername={getUsername(user.name)}
                bio={user.bio}
                menu={MENU_ITEMS}
                pathname={pathname}
                unreadCount={unreadCount}
                isGamesOpen={isGamesOpen}
                setIsGamesOpen={setIsGamesOpen}
              />

              {/* PAGE CONTENT */}
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
