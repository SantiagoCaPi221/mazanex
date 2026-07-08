"use client";

import { useUserStore } from "@/app/store/useUserStore";

import { useUsers } from "./useUsers";
import { useRelationships } from "./useRelationships";
import { useRanking } from "./useRanking";
import { useSocialActions } from "./useSocialActions";

import { filterUsers } from "@/app/components/utils/community/filters";
import type { RankingEntry } from "@/app/components/types/community";

export function useCommunity() {
  // 1. Obtenemos el usuario en bruto y aseguramos la estructura correcta
  const { user: rawUser } = useUserStore();
  const currentUser = rawUser?.user || rawUser;

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
    user: currentUser,

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
      ((rankingHook as { fetchLeaderboard?: () => Promise<void> }).fetchLeaderboard ||
      (rankingHook as { fetchRanking?: () => Promise<void> }).fetchRanking),

    // 🔥 MODO PRO: Inyectamos el ID automáticamente. 
    // La UI solo necesita pasar a quién se le envía (targetId)
    handleSocialAction: (targetId: number) => {
      if (!currentUser?.id) {
        console.error("No hay sesión activa para enviar la solicitud");
        return;
      }
      return social.handleSocialAction(currentUser.id, targetId);
    },
  };
}