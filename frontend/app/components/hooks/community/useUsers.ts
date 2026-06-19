"use client";

import { useEffect, useState } from "react";
import { profileService } from "@/app/clients/profileService";
import { useUserStore } from "@/app/store/useUserStore";

import type { User, UsersFilterType } from "@/app/components/types/community";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UsersFilterType>("ALL");

  // 1. Obtenemos el usuario actual desde tu store global de Zustand
  const { user: rawUser } = useUserStore();
  const currentUser = rawUser?.user || rawUser;

  const fetchUsers = async () => {
    setLoadingUsers(true);

    try {
      const res = await profileService.getAllProfiles();
      
      // 2. Si tenemos tu sesión activa, filtramos la lista para quitarte a ti
      if (currentUser?.id) {
        const usersWithoutMe = (res || []).filter((u: User) => u.id !== currentUser.id);
        setUsers(usersWithoutMe);
      } else {
        // Si no hay sesión por alguna razón, mostramos todos
        setUsers(res || []);
      }
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser?.id]); // Re-ejecuta el filtro si cambia la sesión

  return {
    users,
    loadingUsers,

    search,
    setSearch,

    filter,
    setFilter,
  };
}