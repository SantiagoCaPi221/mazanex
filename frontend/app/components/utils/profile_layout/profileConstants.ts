import { ProfileMenuItem } from "@/app/components/types/user";

export const DEFAULT_BACKGROUND =
  "https://i.pinimg.com/originals/a1/9f/c0/a19fc0f1c37b120c159846c87994806a.gif";

export const PROFILE_GAME_ROUTES = [
  "/pages/profile/snake",
  "/pages/profile/kof",
  "/pages/profile/bloody",
  "/pages/profile/smash",
];

export const MENU_ITEMS: ProfileMenuItem[] = [
  {
    name: "Perfil General",
    href: "/pages/profile",
  },

  {
    name: "Seguridad",
    href: "/pages/profile/security",
  },

  {
    name: "Juegos",

    isDropdown: true,

    subItems: [
      {
        name: "Mazanex Snake",
        href: "/pages/profile/snake",
      },

      {
        name: "coming soon...",
        href: "",
      },
    ],
  },

  {
    name: "Notificaciones",
    href: "/pages/profile/notifications",
  },
];
