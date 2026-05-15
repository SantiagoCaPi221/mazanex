import { ProfileMenuItem } from "@/app/types/user";

export const DEFAULT_BACKGROUND =
  "https://i.pinimg.com/originals/a1/9f/c0/a19fc0f1c37b120c159846c87994806a.gif";

export const PROFILE_GAME_ROUTES = [
  "/profile/snake",
  "/profile/kof",
  "/profile/bloody",
  "/profile/smash",
];

export const MENU_ITEMS: ProfileMenuItem[] = [
  {
    name: "Perfil General",
    href: "/profile",
  },

  {
    name: "Seguridad",
    href: "/profile/security",
  },

  {
    name: "Juegos",

    isDropdown: true,

    subItems: [
      {
        name: "Mazanex Snake",
        href: "/profile/snake",
      },

      {
        name: "KOF 2002",
        href: "/profile/kof",
      },
    ],
  },

  {
    name: "Notificaciones",
    href: "/profile/notifications",
  },
];
