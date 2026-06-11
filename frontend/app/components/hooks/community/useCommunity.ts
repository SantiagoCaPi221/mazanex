"use client";

import { useUserStore } from "@/app/store/useUserStore";

import { useUsers } from "./useUsers";
import { useRelationships } from "./useRelationships";
import { useRanking } from "./useRanking";
import { useSocialActions } from "./useSocialActions";

import { filterUsers } from "@/app/components/utils/community/filters";

export function useCommunity() {
  const { user } = useUserStore();

  const usersHook = useUsers();
  const relationshipsHook = useRelationships(usersHook.users);
  const rankingHook = useRanking();

  const social = useSocialActions({
    relationships: relationshipsHook.relationships,
    setRelationships: relationshipsHook.setRelationships,
  });

  const users = filterUsers({
    users: usersHook.users,
    search: usersHook.search,
    filter: usersHook.filter,
    relationships: relationshipsHook.relationships,
  });

  return {
    user,

    loading: usersHook.loadingUsers || relationshipsHook.loadingRelationships,

    users,

    relationships: relationshipsHook.relationships,

    search: usersHook.search,
    setSearch: usersHook.setSearch,

    filter: usersHook.filter,
    setFilter: usersHook.setFilter,

    ranking: rankingHook.ranking,
    loadingRanking: rankingHook.loadingRanking,
    selectedGame: rankingHook.selectedGame,
    setSelectedGame: rankingHook.setSelectedGame,
    availableGames: rankingHook.availableGames,

    fetchLeaderboard:
      (rankingHook as any).fetchLeaderboard ||
      (rankingHook as any).fetchRanking,

    handleSocialAction: social.handleSocialAction,
  };
}
