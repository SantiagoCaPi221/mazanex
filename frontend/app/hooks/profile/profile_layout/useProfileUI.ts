"use client";

import { useEffect, useState } from "react";

export function useProfileUI(pathname: string) {
  const [isGamesOpen, setIsGamesOpen] = useState(false);

  const [isProfileVisible, setIsProfileVisible] = useState(true);

  useEffect(() => {
    const routes = [
      "/profile/snake",
      "/profile/kof",
      "/profile/bloody",
      "/profile/smash",
    ];

    if (routes.includes(pathname)) {
      setIsGamesOpen(true);
    }
  }, [pathname]);

  return {
    isGamesOpen,
    setIsGamesOpen,

    isProfileVisible,
    setIsProfileVisible,
  };
}
