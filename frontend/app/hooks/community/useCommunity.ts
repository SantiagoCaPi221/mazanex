"use client";

import { useMemo } from "react";

import { useUsers } from "./useUsers";
import { useRelationships } from "./useRelationships";
import { useRanking } from "./useRanking";
import { useSocialActions } from "./useSocialActions";

import { useUserStore } from "@/store/useUserStore";

import { filterUsers } from "../../utils/community/filters";

export function useCommunity() {
  const { user } = useUserStore();

  const {
    users,
    loadingUsers,

    search,
    setSearch,

    filter,
    setFilter,
  } = useUsers();

  const { relationships, setRelationships, loadingRelationships } =
    useRelationships(users);

  const {
    ranking,
    loadingRanking,

    selectedGame,
    setSelectedGame,

    availableGames,
  } = useRanking();

  const { handleSocialAction } = useSocialActions({
    relationships,
    setRelationships,
  });

  const filteredUsers = useMemo(() => {
    return filterUsers({
      users,
      search,
      filter,
      relationships,
    });
  }, [users, search, filter, relationships]);

  return {
    user,

    loading: loadingUsers || loadingRelationships,

    users: filteredUsers,

    relationships,

    search,
    setSearch,

    filter,
    setFilter,

    ranking,
    loadingRanking,

    selectedGame,
    setSelectedGame,

    availableGames,

    handleSocialAction,
  };
}
