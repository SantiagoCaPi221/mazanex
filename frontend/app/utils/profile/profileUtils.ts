import { ProfileUser } from "../../types/profile";

export const getInitialProfileForm = (user: ProfileUser | null) => ({
  name: user?.name ?? "",
  bio: user?.bio ?? "",
});
