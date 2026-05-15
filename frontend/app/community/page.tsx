"use client";

import { useCommunity } from "@/app/hooks/community/useCommunity";

import { UsersGrid } from "@/components/comp_community/UsersGrid";
import { Leaderboard } from "@/components/comp_community/Leaderboard";
import { GameSelector } from "@/components/comp_community/GameSelector";
import { EvidenceModal } from "@/components/comp_community/EvidenceModal";

export default function CommunityPage() {
  const {
    user,
    loading,
    users,
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
  } = useCommunity();

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      {/* USERS */}
      <UsersGrid
        users={users}
        relationships={relationships}
        onAction={handleSocialAction}
      />

      {/* GAME SELECTOR */}
      <GameSelector
        games={availableGames}
        selected={selectedGame}
        onChange={setSelectedGame}
      />

      {/* LEADERBOARD */}
      <Leaderboard
        data={ranking}
        game={selectedGame}
        onSelectEvidence={() => {}}
      />
    </div>
  );
}
