"use client";

import { useEffect, useState } from "react";

import { profileService } from "@/service/profileService";
import { useUserStore } from "@/store/useUserStore";

import { User } from "../../types/community";

export function useUsers() {
  const { user } = useUserStore();

  const [users, setUsers] = useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<"ALL" | "FRIENDS">("ALL");

  const loadUsers = async () => {
    if (!user?.id) return;

    setLoadingUsers(true);

    try {
      const usersList = await profileService.getAllProfiles();

      if (usersList) {
        const filteredUsers = usersList.filter(
          (u: User) => Number(u.id) !== Number(user.id)
        );

        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user?.id]);

  return {
    users,
    loadingUsers,

    search,
    setSearch,

    filter,
    setFilter,
  };
}
