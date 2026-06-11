"use client";

import { useEffect, useState } from "react";
import { profileService } from "@/app/clients/profileService";

import type { User, UsersFilterType } from "@/app/components/types/community";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UsersFilterType>("ALL");

  const fetchUsers = async () => {
    setLoadingUsers(true);

    try {
      const res = await profileService.getAllProfiles();
      setUsers(res || []);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loadingUsers,

    search,
    setSearch,

    filter,
    setFilter,
  };
}
