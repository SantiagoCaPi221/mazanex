"use client";

import { useState } from "react";
import { useCommunity } from "@/app/components/hooks/community/useCommunity";
import { useUserStore } from "@/app/store/useUserStore";
import { gameService } from "@/app/clients/gameService";

import { UsersGrid } from "@/app/components/comp_community/UsersGrid";
import { Leaderboard } from "@/app/components/comp_community/Leaderboard";
import { GameSelector } from "@/app/components/comp_community/GameSelector";
import { EvidenceModal } from "@/app/components/comp_community/EvidenceModal";
import { Feed } from "@/app/components/comp_community/Feed";

import { Users, Search, Trophy } from "lucide-react";
import type { RankingEntry } from "@/app/components/types/community";

export default function CommunityPage() {
  const { user: rawUser, showNotification } = useUserStore();
  const currentUser = rawUser?.user || rawUser;

  const {
    loading,
    users,
    relationships,
    ranking,
    loadingRanking,
    selectedGame,
    setSelectedGame,
    availableGames,
    handleSocialAction, // Esta función ya viene inyectada con tu ID desde useCommunity
    fetchLeaderboard,
  } = useCommunity();

  const [searchQuery, setSearchQuery] = useState("");
  // Agregamos "FEED" a las opciones del estado
  const [filterType, setFilterType] = useState<"ALL" | "FRIENDS" | "FEED">(
    "FEED"
  );
  const [selectedSnakeMode, setSelectedSnakeMode] = useState<string>("TODOS");
  const [selectedEvidence, setSelectedEvidence] = useState<RankingEntry | null>(
    null
  );

  const handleReportEvidence = async (scoreId: number) => {
    // Usamos el currentUser desempaquetado
    if (!currentUser?.id) return;
    if (
      !confirm(
        "¿Reportar evidencia? 3 reportes de usuarios distintos la eliminarán."
      )
    )
      return;

    const result = await gameService.reportScore(scoreId, currentUser.id);

    if (result?.error === "ALREADY_REPORTED") {
      showNotification(
        "Ya has reportado esta evidencia anteriormente.",
        "error"
      );
      setSelectedEvidence(null);
      return;
    }

    if (result?.status === "DELETED") {
      showNotification(
        "Evidencia eliminada por consenso comunitario.",
        "error"
      );
      setSelectedEvidence(null);
      if (fetchLeaderboard) fetchLeaderboard();
    } else if (result) {
      showNotification(
        `Reporte registrado (${result.count || 1}/3).`,
        "success"
      );
      setSelectedEvidence(null);
    }
  };

  // Filtrado local de usuarios
  const filteredUsers = users.filter((u) => {
    const matchesName = u.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "ALL" ? true : relationships[u.id]?.status === "ACCEPTED";
    return matchesName && matchesFilter;
  });

  // Lógica de Sub-Filtros Dinámicos para SNAKE
  const snakeModes =
    selectedGame === "SNAKE"
      ? Array.from(new Set(ranking.map((s) => s.mode || "ESTÁNDAR")))
      : [];
  const displayedLeaderboard =
    selectedGame === "SNAKE" && selectedSnakeMode !== "TODOS"
      ? ranking.filter((s) => (s.mode || "ESTÁNDAR") === selectedSnakeMode)
      : ranking;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white overflow-x-hidden">
      <EvidenceModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        onReport={handleReportEvidence}
      />

      {/* Fondo Punteado */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto p-6 md:p-12">
        {/* HEADER & BUSCADOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Comunidad <span className="text-indigo-500">Mazanex</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" />
            <input
              type="text"
              placeholder="BUSCAR PLAYER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black"
            />
          </div>
        </div>

        {/* LAYOUT PRINCIPAL (8 / 4) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* LADO IZQUIERDO: USUARIOS O MURO */}
          <div className="xl:col-span-8 space-y-8">
            <div className="flex gap-8 border-b border-white/5 overflow-x-auto pb-1">
              {/* PESTAÑA MURO */}
              <button
                onClick={() => setFilterType("FEED")}
                className={`pb-4 text-xs font-black tracking-[0.3em] relative whitespace-nowrap ${
                  filterType === "FEED"
                    ? "text-indigo-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                MURO MAZANEX
                {filterType === "FEED" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                )}
              </button>

              {/* PESTAÑA DESCUBRIR */}
              <button
                onClick={() => setFilterType("ALL")}
                className={`pb-4 text-xs font-black tracking-[0.3em] relative whitespace-nowrap ${
                  filterType === "ALL"
                    ? "text-indigo-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                DESCUBRIR
                {filterType === "ALL" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                )}
              </button>

              {/* PESTAÑA AMIGOS */}
              <button
                onClick={() => setFilterType("FRIENDS")}
                className={`pb-4 text-xs font-black tracking-[0.3em] relative whitespace-nowrap ${
                  filterType === "FRIENDS"
                    ? "text-indigo-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                MIS AMIGOS
                {filterType === "FRIENDS" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                )}
              </button>
            </div>

            {/* AQUI SE HACE LA MAGIA: Si es FEED muestra el muro, si no, muestra los usuarios */}
            {filterType === "FEED" ? (
              <Feed />
            ) : (
              <UsersGrid
                users={filteredUsers}
                relationships={relationships}
                onAction={handleSocialAction}
              />
            )}
          </div>

          {/* LADO DERECHO: RANKING (STICKY) */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-sm sticky top-8">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                    Ranking Global
                  </h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                    Salón de la Fama
                  </p>
                </div>
              </div>

              <GameSelector
                games={availableGames as string[]}
                selected={selectedGame as string}
                onChange={setSelectedGame as any}
                currentSubMode={selectedSnakeMode}
                onSubModeChange={setSelectedSnakeMode}
                snakeModes={snakeModes as string[]}
              />

              {loadingRanking ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <Leaderboard
                  data={displayedLeaderboard}
                  game={selectedGame as string}
                  onSelectEvidence={setSelectedEvidence}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}